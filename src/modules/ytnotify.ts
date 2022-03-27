// @ts-ignore
import YouTubeNotifier from 'youtube-notification';
import yts from 'yt-search';
import express from 'express';
import axios from 'axios';
import { app, port } from './webserver';
import { MessageEmbed } from 'discord.js';
import { bot } from '..';
import ConsoleLogger from '../utils/consolelogger';

export async function setupYoutubeNotifier() {
   const ip = await getMyIp();
   const baseurl = `http://${ip}:${port}`;
   const notificationEndpoint = '/youtube/notifications';
   const notifier = new YouTubeNotifier({
      hubCallback: `${baseurl}${notificationEndpoint}`,
      secret: generateSecret(),
   });
   app.use(notificationEndpoint, notifier.listener());
   notifier.subscribe(process.env.YOUTUBE_CHANNEL_ID);

   notifier.on('subscribe', (data: any) => {
      console.log('Subscribed');
      console.log(data);
   });

   notifier.on('notified', async (data: any) => {
      console.log('New Video');
      console.log(data);
      const video = await getVideoInformation(data.video.link);
      const channel = await bot.getChannel(
         process.env.YOUTUBE_DISCORD_CHANNEL_ID,
      );

      if (!channel)
         return new ConsoleLogger(
            'YOUTUBE_DISCORD_CHANNEL_ID not found',
         ).error();

      if (!channel.isText()) {
         return new ConsoleLogger(
            'YOUTUBE_DISCORD_CHANNEL_ID is not a text channel',
         ).error();
      }

      const embed = new MessageEmbed()
         .setTitle(`${video.author.name} hat ein neues Video hochgeladen`)
         .setAuthor({
            name: video.author.name,
            iconURL: 'https://uploads.mxgnus.de/uploads/images/d0b4c796.png',
            url: video.author.url,
         })
         .setURL(video.url)
         .setDescription(
            `[${video.author.name}](${video.author.url}) hat ein neues Video mit dem Namen ${video.title} hochgeladen!`,
         )
         .setImage(video.thumbnail)
         .setFields([
            {
               name: 'Title',
               value: video.title,
            },
            {
               name: 'Beschreibung',
               value: video.description,
            },
            {
               name: 'Länge',
               value: video.duration.timestamp,
            },
            {
               name: 'Video Id',
               value: video.videoId,
            },
            {
               name: 'Url',
               value: video.url,
            },
         ])
         .setColor('#00ff00 ');

      channel.send({
         embeds: [embed],
      });
   });
}

function getMyIp() {
   return new Promise((resolve, reject) => {
      axios
         .get('https://api.ipify.org?format=json')
         .then((res) => {
            resolve(res.data.ip);
         })
         .catch((err) => {
            reject(err);
         });
   });
}

function generateSecret() {
   return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
   );
}

async function getVideoInformation(url: string) {
   const result = await yts(url);
   const video = result.videos[0];
   return video;
}
