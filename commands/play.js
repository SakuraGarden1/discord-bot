const { EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const yts = require('yt-search');

const queues = new Map();
module.exports.queues = queues;

function getQueue(guildId) {
  if (!queues.has(guildId)) {
    queues.set(guildId, { songs: [], player: null, connection: null, loop: false, volume: 1 });
  }
  return queues.get(guildId);
}

async function playSong(guild, queue, message) {
  if (queue.songs.length === 0) {
    if (queue.connection) { queue.connection.destroy(); }
    queues.delete(guild.id);
    return;
  }

  const song = queue.songs[0];
  const stream = ytdl(song.url, { filter: 'audioonly', quality: 'lowestaudio', highWaterMark: 1 << 25 });
  const resource = createAudioResource(stream, { inlineVolume: true });
  resource.volume?.setVolume(queue.volume);

  queue.player.play(resource);

  const embed = new EmbedBuilder()
    .setColor(0xE8B84B)
    .setTitle('🎵 Одоо тоглуулж байна')
    .addFields(
      { name: '🎶 Дуу', value: song.title },
      { name: '⏱️ Хугацаа', value: song.duration },
      { name: '👤 Нэмсэн', value: song.requestedBy },
    )
    .setThumbnail(song.thumbnail);

  message.channel.send({ embeds: [embed] });
}

module.exports = {
  name: 'play',
  aliases: ['p'],
  async execute(message, args) {
    const embed = new EmbedBuilder().setColor(0xE8B84B);

    if (!message.member.voice.channel) {
      return message.reply({ embeds: [embed.setTitle('❌ Эхлээд voice channel-д орно уу!')] });
    }

    const query = args.join(' ');
    if (!query) return message.reply({ embeds: [embed.setTitle('❌ Дууны нэр эсвэл link оруул.')] });

    const searching = await message.reply({ embeds: [embed.setTitle(`🔍 Хайж байна: ${query}`)] });

    try {
      let songInfo;
      if (query.includes('youtube.com') || query.includes('youtu.be')) {
        const info = await ytdl.getInfo(query);
        songInfo = {
          title: info.videoDetails.title,
          url: info.videoDetails.video_url,
          duration: new Date(info.videoDetails.lengthSeconds * 1000).toISOString().substr(11, 8),
          thumbnail: info.videoDetails.thumbnails[0]?.url,
          requestedBy: message.author.username,
        };
      } else {
        const result = await yts(query);
        const video = result.videos[0];
        if (!video) return searching.edit({ embeds: [embed.setTitle('❌ Дуу олдсонгүй!')] });
        songInfo = {
          title: video.title,
          url: video.url,
          duration: video.duration.timestamp,
          thumbnail: video.thumbnail,
          requestedBy: message.author.username,
        };
      }

      const queue = getQueue(message.guild.id);

      if (!queue.connection) {
        queue.connection = joinVoiceChannel({
          channelId: message.member.voice.channel.id,
          guildId: message.guild.id,
          adapterCreator: message.guild.voiceAdapterCreator,
        });
        queue.player = createAudioPlayer();
        queue.connection.subscribe(queue.player);

        queue.player.on(AudioPlayerStatus.Idle, () => {
          if (!queue.loop) queue.songs.shift();
          if (queue.songs.length > 0) playSong(message.guild, queue, message);
          else { queue.connection?.destroy(); queues.delete(message.guild.id); }
        });

        queue.player.on('error', err => {
          console.error(err);
          queue.songs.shift();
          if (queue.songs.length > 0) playSong(message.guild, queue, message);
        });
      }

      queue.songs.push(songInfo);

      if (queue.songs.length === 1) {
        playSong(message.guild, queue, message);
        await searching.delete().catch(() => {});
      } else {
        await searching.edit({ embeds: [new EmbedBuilder().setColor(0xE8B84B).setTitle('✅ Queue-д нэмэгдлээ').setDescription(`🎶 **${songInfo.title}**\n⏱️ ${songInfo.duration}`)] });
      }
    } catch (err) {
      console.error(err);
      searching.edit({ embeds: [embed.setTitle('❌ Дуу тоглуулж чадсангүй. Дахин оролдоно уу.')] });
    }
  },
};
