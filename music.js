const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
  NoSubscriberBehavior,
  StreamType,
} = require('@discordjs/voice');
const playdl = require('play-dl');
const yts = require('yt-search');

const queues = new Map();

function getQueue(guildId) {
  if (!queues.has(guildId)) {
    const player = createAudioPlayer({ behavior: NoSubscriberBehavior.Pause });
    const q = { songs: [], player, connection: null, guildId, loop: false };
    player.on(AudioPlayerStatus.Idle, () => onIdle(guildId));
    player.on('error', (e) => {
      console.error('[player error]', e.message);
      const q2 = queues.get(guildId);
      if (q2 && q2.songs.length) { q2.songs.shift(); void playTrack(guildId); }
    });
    queues.set(guildId, q);
  }
  return queues.get(guildId);
}

function onIdle(guildId) {
  const q = queues.get(guildId);
  if (!q) return;
  if (q.loop && q.songs.length) {
    void playTrack(guildId);
  } else {
    q.songs.shift();
    if (q.songs.length) void playTrack(guildId);
  }
}

async function playTrack(guildId) {
  const q = queues.get(guildId);
  if (!q || !q.connection || !q.songs.length) return;
  const song = q.songs[0];
  try {
    const src = await playdl.stream(song.url, { quality: 2 });
    const resource = createAudioResource(src.stream, {
      inputType: src.type,
      inlineVolume: false,
    });
    q.player.play(resource);
    console.log('[playing]', song.title);
  } catch (e) {
    console.error('[playTrack error]', e.message);
    q.songs.shift();
    void playTrack(guildId);
  }
}

async function ensureConnection(message) {
  const channel = message.member?.voice?.channel;
  if (!channel) return null;
  const q = getQueue(message.guild.id);

  if (q.connection) {
    const status = q.connection.state.status;
    if (status === VoiceConnectionStatus.Destroyed) {
      q.connection = null;
    } else if (q.connection.joinConfig.channelId === channel.id) {
      return q.connection;
    } else {
      q.connection.destroy();
      q.connection = null;
    }
  }

  q.connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: message.guild.id,
    adapterCreator: message.guild.voiceAdapterCreator,
    selfDeaf: true,
  });

  try {
    await entersState(q.connection, VoiceConnectionStatus.Ready, 15_000);
  } catch (e) {
    console.error('[connection error]', e.message);
    q.connection.destroy();
    q.connection = null;
    throw e;
  }

  q.connection.subscribe(q.player);

  q.connection.on(VoiceConnectionStatus.Disconnected, async () => {
    try {
      await Promise.race([
        entersState(q.connection, VoiceConnectionStatus.Signalling, 5_000),
        entersState(q.connection, VoiceConnectionStatus.Connecting, 5_000),
      ]);
    } catch {
      if (q.connection) { q.connection.destroy(); q.connection = null; }
    }
  });

  return q.connection;
}

async function resolveQuery(query) {
  const trimmed = query.trim();
  if (!trimmed) return null;

  if (trimmed.includes('youtube.com/watch') || trimmed.includes('youtu.be/')) {
    try {
      const info = await playdl.video_basic_info(trimmed);
      return [{ title: info.video_details.title, url: trimmed }];
    } catch (e) {
      console.error('[resolveQuery url]', e.message);
      return null;
    }
  }

  try {
    const results = await playdl.search(trimmed, { limit: 1, source: { youtube: 'video' } });
    if (!results.length) return null;
    return [{ title: results[0].title, url: results[0].url }];
  } catch (e) {
    // play-dl search fails, fallback to yt-search
    console.error('[playdl search fail, fallback]', e.message);
    try {
      const r = await yts(trimmed);
      const v = r.videos[0];
      if (!v) return null;
      return [{ title: v.title, url: v.url }];
    } catch (e2) {
      console.error('[yts fallback fail]', e2.message);
      return null;
    }
  }
}

async function enqueue(message, query) {
  const list = await resolveQuery(query);
  if (!list?.length) return { ok: false, error: 'Юу ч олдсонгүй.' };
  await ensureConnection(message);
  const q = getQueue(message.guild.id);
  const requester = message.author.username;
  for (const s of list) q.songs.push({ ...s, requester });
  if (q.player.state.status === AudioPlayerStatus.Idle) await playTrack(message.guild.id);
  return { ok: true, added: list.length, titles: list.map(x => x.title) };
}

function skipMusic(guildId) {
  const q = queues.get(guildId);
  if (!q || !q.songs.length) return false;
  q.player.stop();
  return true;
}

function stopMusic(guildId) {
  const q = queues.get(guildId);
  if (!q) return;
  q.songs = [];
  q.loop = false;
  q.player.stop(true);
}

function leaveVoice(guildId) {
  const q = queues.get(guildId);
  if (!q) return;
  q.songs = [];
  q.loop = false;
  q.player.stop(true);
  if (q.connection) { q.connection.destroy(); q.connection = null; }
  queues.delete(guildId);
}

function toggleLoop(guildId) {
  const q = queues.get(guildId);
  if (!q) return null;
  q.loop = !q.loop;
  return q.loop;
}

function getNowPlaying(guildId) {
  const q = queues.get(guildId);
  return (q && q.songs.length) ? q.songs[0] : null;
}

function getQueueList(guildId) {
  const q = queues.get(guildId);
  return q ? q.songs.slice() : [];
}

function isLooping(guildId) {
  const q = queues.get(guildId);
  return q ? q.loop : false;
}

module.exports = { enqueue, skipMusic, stopMusic, leaveVoice, toggleLoop, getNowPlaying, getQueueList, ensureConnection, isLooping };
