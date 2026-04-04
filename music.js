const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
  NoSubscriberBehavior,
} = require('@discordjs/voice');
const play = require('play-dl');

const MAX_PLAYLIST = 25;
const queues = new Map();

function getQueue(guildId) {
  if (!queues.has(guildId)) {
    const player = createAudioPlayer({ behavior: NoSubscriberBehavior.Play });
    const q = { songs: [], player, connection: null, guildId };
    player.on(AudioPlayerStatus.Idle, () => onIdle(guildId));
    player.on('error', (e) => console.error('[music player]', e));
    queues.set(guildId, q);
  }
  return queues.get(guildId);
}

function onIdle(guildId) {
  const q = queues.get(guildId);
  if (!q || !q.songs.length) return;
  q.songs.shift();
  void playTrack(guildId);
}

async function playTrack(guildId) {
  const q = queues.get(guildId);
  if (!q || !q.connection || !q.songs.length) return;
  const song = q.songs[0];
  try {
    const src = await play.stream(song.url);
    const resource = createAudioResource(src.stream, { inputType: src.type });
    q.player.play(resource);
    play.attachListeners(q.player, src);
  } catch (e) {
    console.error('[playTrack]', e);
    q.songs.shift();
    void playTrack(guildId);
  }
}

async function ensureConnection(message) {
  const channel = message.member?.voice?.channel;
  if (!channel) return null;
  const q = getQueue(message.guild.id);
  if (q.connection && q.connection.state.status !== VoiceConnectionStatus.Destroyed) {
    if (q.connection.joinConfig.channelId !== channel.id) {
      q.connection.destroy();
      q.connection = null;
    }
  }
  if (!q.connection) {
    q.connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
      selfDeaf: true,
    });
    try {
      await entersState(q.connection, VoiceConnectionStatus.Ready, 30_000);
    } catch (e) {
      q.connection.destroy();
      q.connection = null;
      throw e;
    }
    q.connection.subscribe(q.player);
  }
  return q.connection;
}

async function resolveQuery(query) {
  const trimmed = query.trim();
  if (!trimmed) return null;
  try {
    const val = await play.validate(trimmed);
    if (val === 'yt_video') {
      const info = await play.video_basic_info(trimmed);
      const vd = info.video_details;
      return [{ title: vd.title || 'YouTube', url: vd.url || trimmed }];
    }
    if (val === 'yt_playlist') {
      const pl = await play.playlist_info(trimmed, { incomplete: true });
      const videos = await pl.all_videos();
      return videos.slice(0, MAX_PLAYLIST).map((v) => ({ title: v.title || 'YouTube', url: v.url }));
    }
  } catch (e) {
    console.error('[resolveQuery url]', e);
  }
  try {
    const found = await play.search(trimmed, { limit: 1, source: { youtube: 'video' } });
    if (!found.length) return null;
    const v = found[0];
    return [{ title: v.title || trimmed, url: v.url }];
  } catch (e) {
    console.error('[resolveQuery search]', e);
    return null;
  }
}

async function enqueue(message, query) {
  const list = await resolveQuery(query);
  if (!list?.length) return { ok: false, error: 'Юу ч олдсонгүй.' };
  await ensureConnection(message);
  const q = getQueue(message.guild.id);
  const requester = message.author.tag;
  for (const s of list) {
    q.songs.push({ title: s.title, url: s.url, requester });
  }
  if (q.player.state.status === AudioPlayerStatus.Idle && q.songs.length) {
    await playTrack(message.guild.id);
  }
  return { ok: true, added: list.length, titles: list.map((x) => x.title) };
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
  q.songs.length = 0;
  q.player.stop(true);
}

function leaveVoice(guildId) {
  const q = queues.get(guildId);
  if (!q) return;
  q.songs.length = 0;
  q.player.stop(true);
  if (q.connection) {
    q.connection.destroy();
    q.connection = null;
  }
  queues.delete(guildId);
}

function getNowPlaying(guildId) {
  const q = queues.get(guildId);
  if (!q || !q.songs.length) return null;
  return q.songs[0];
}

function getQueueList(guildId) {
  const q = queues.get(guildId);
  return q ? q.songs.slice() : [];
}

module.exports = {
  enqueue,
  skipMusic,
  stopMusic,
  leaveVoice,
  getNowPlaying,
  getQueueList,
  ensureConnection,
};
