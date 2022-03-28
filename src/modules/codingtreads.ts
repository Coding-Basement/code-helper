import { MessageEmbed, ThreadChannel } from 'discord.js';
import { bot } from '..';
import prisma from '../prisma/client';
import ConsoleLogger from '../utils/consolelogger';

export async function fetchThreads() {
   const guild = await bot.getGuild();
   if (!guild)
      return new ConsoleLogger('THREAD_MANAGER: Could not fetch guild').error();
   const channel = await bot.getChannel(process.env.DISCORD_CODING_BETA);
   if (!channel)
      return new ConsoleLogger(
         'THREAD_MANAGER: Could not fetch channel',
      ).error();
   if (!channel.isText() || channel.isThread())
      return new ConsoleLogger(
         'THREAD_MANAGER: Channel is not a text channel',
      ).error();
   const threads = await channel.threads.fetch();
   return threads;
}

export async function setupThreadManager() {
   await updateThreadNotifyMessage();
}

export async function sendThreadNotifyMessage({
   embed,
}: {
   embed: MessageEmbed;
}) {
   const threadNotifyMessageId = await prisma.config.findUnique({
      where: {
         name: 'threadNotifyMessageId',
      },
   });

   const channel = await bot.getChannel(process.env.DISCORD_CODING_BETA_NOTIFY);
   if (!channel)
      return new ConsoleLogger(
         'THREAD_MANAGER: Could not fetch channel',
      ).error();
   if (!channel.isText())
      return new ConsoleLogger(
         'THREAD_MANAGER: Channel is not a text channel',
      ).error();

   if (!threadNotifyMessageId) {
      const message = await channel.send({
         embeds: [embed],
      });
      await prisma.config.create({
         data: {
            name: 'threadNotifyMessageId',
            value: message.id,
         },
      });
   } else {
      const message = await bot.getMessage(
         threadNotifyMessageId.value,
         process.env.DISCORD_CODING_BETA_NOTIFY,
      );

      if (!message) {
         const newMessage = await channel.send({
            embeds: [embed],
         });
         await prisma.config.update({
            where: {
               name: 'threadNotifyMessageId',
            },
            data: {
               value: newMessage.id,
            },
         });
      } else {
         await message.delete();
         await channel.send({
            embeds: [embed],
         });
      }
   }
}

export async function updateThreadNotifyMessage() {
   const threads = await fetchThreads();
   if (!threads) return;

   let description = '';

   await Promise.all(
      threads.threads.map(async (thread) => {
         const dbThread = await prisma.helpThread.findUnique({
            where: {
               id: thread.id,
            },
         });

         if (!dbThread) return;
         const member = await bot.getMember(dbThread.userid);
         if (!member) return;
         description += `**${dbThread.title} - ${member.user.tag}**\n<#${dbThread.id}>\n\n`;
      }),
   );
   const embed = new MessageEmbed()
      .setTitle('<:VerifiedDev:768097818430406686> Geöffnete Threads')
      .setDescription(
         '**Hier siehst du alle alle offenen Coding-Probleme Threads**\n\n' +
            description,
      )
      .setColor(bot.colors.light_blue);

   sendThreadNotifyMessage({
      embed,
   });
}
