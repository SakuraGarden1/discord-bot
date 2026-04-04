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
const ytdl = require('@distube/ytdl-core');
const yts = require('yt-search');

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
    const stream = ytdl(song.url, {
      filter: 'audioonly',
      quality: 'lowestaudio',
      highWaterMark: 1 << 25,
    });
    const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
    q.player.play(resource);
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

  // YouTube URL шууд өгсөн бол
  if (trimmed.includes('youtube.com/watch') || trimmed.includes('youtu.be/')) {
    try {
      const info = await ytdl.getInfo(trimmed);
      return [{ title: info.videoDetails.title, url: trimmed }];
    } catch (e) {
      console.error('[resolveQuery url]', e);
      return null;
    }
  }

  // Текстээр хайх
  try {
    const results = await yts(trimmed);
    const videos = results.videos.slice(0, 1);
    if (!videos.length) return null;
    return [{ title: videos[0].title, url: videos[0].url }];
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
