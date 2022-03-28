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
   const channel = await bot.getChannel(process.env.DISCORD_CODING_BETA_NOTIFY);
   if (!channel)
      return new ConsoleLogger(
         'THREAD_MANAGER: Could not fetch channel',
      ).error();
   if (!channel.isText())
      return new ConsoleLogger(
         'THREAD_MANAGER: Channel is not a text channel',
      ).error();

   const threadNotificationMessageId = await prisma.config.findUnique({
      where: {
         name: 'threadNotificationMessageId',
      },
   });

   const messages = await channel.messages.fetch();
   const filteredMessages = messages.filter((msg) => {
      if (msg.pinned) return false;
      else if (msg.id === threadNotificationMessageId?.value) return false;
      else return true;
   });
   await Promise.all(filteredMessages.map((msg) => msg.delete()));
   const msg = await channel.messages
      .fetch(threadNotificationMessageId?.value || '')
      .catch(() => null);

   if (msg) {
      return await msg.edit({
         embeds: [embed],
      });
   } else {
      const newmsg = await channel.send({
         embeds: [embed],
      });
      await prisma.config.upsert({
         where: {
            name: 'threadNotificationMessageId',
         },
         create: {
            name: 'threadNotificationMessageId',
            value: newmsg.id,
         },
         update: {
            name: 'threadNotificationMessageId',
            value: newmsg.id,
         },
      });
      return;
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

   await sendThreadNotifyMessage({
      embed,
   });
}
