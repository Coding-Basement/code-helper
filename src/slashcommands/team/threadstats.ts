import { HelpThread } from '@prisma/client';
import { MessageEmbed } from 'discord.js';
import { bot } from '../..';
import prisma from '../../prisma/client';
import { SlashCommand } from '../../Structures/SlashCommand';

export default new SlashCommand({
   name: 'threadstats',
   description: 'Zeigt die Statistiken der Coding-Threads an',
   permission: 'ADMINISTRATOR',
   execute: async ({ interaction, args }) => {
      const allThreads = await prisma.helpThread.findMany();

      const users = new Map<string, { count: number; threads: HelpThread[] }>();

      allThreads.forEach((thread) => {
         if (!users.has(thread.userid)) {
            users.set(thread.userid, {
               count: 0,
               threads: [],
            });
         }

         const user = users.get(thread.userid);
         users.set(thread.userid, {
            count: user?.count ? user.count + 1 : 1,
            threads: [thread, ...(user?.threads ?? [])],
         });
      });

      const sortedUsers = [...users.entries()].sort((a, b) => {
         return b[1].count - a[1].count;
      });

      const totalThreads = allThreads.length;
      const userWithMostThreads = sortedUsers[0];

      const embed = new MessageEmbed()
         .setTitle('> Coding Thread Statistiken')
         .setDescription(
            'Hier sind die Statistiken der Coding-Threads: \n\n > **Anzahl der Threads:** ' +
               totalThreads +
               '\n > **Der User mit den meinsten Threads:** <@' +
               userWithMostThreads[0] +
               '> (' +
               userWithMostThreads[1].count +
               ')',
         )
         .setColor(bot.colors.aqua);

      return interaction.reply({
         embeds: [embed],
         ephemeral: true,
      });
   },
});
