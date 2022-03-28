import { bot } from '../..';
import prisma from '../../prisma/client';
import { SlashCommand } from '../../Structures/SlashCommand';

export default new SlashCommand({
   name: 'threadpromote',
   description: 'Pingt die PingProgrammierer Rolle (nur 1x pro Thread)',
   execute: async ({ interaction, args }) => {
      const channel = await bot.getChannel(interaction.channelId);
      if (!channel)
         return interaction.reply({
            content:
               'Dieser command ist nur im <#' +
               process.env.DISCORD_CODING_BETA +
               '> Channel verfügbar',
            ephemeral: true,
         });
      if (!channel.isThread()) {
         return interaction.reply({
            content: 'Dieser command ist nur im Thread verfügbar',
            ephemeral: true,
         });
      }

      const dbThread = await prisma.helpThread.findUnique({
         where: {
            id: channel.id,
         },
      });

      if (!dbThread) {
         return interaction.reply({
            content:
               'Dieser Thread existiert nicht/Ist kein Coding Help Thread',
            ephemeral: true,
         });
      }

      if (dbThread.ispromoted) {
         return interaction.reply({
            content: 'Für diesen Thread wurde der Ping bereits aufgebraucht',
            ephemeral: true,
         });
      }

      const mainChannel = await bot.getChannel(process.env.DISCORD_CODING_BETA);
      if (!mainChannel) {
         return interaction.reply({
            content:
               'Dieser command ist nur im <#' +
               process.env.DISCORD_CODING_BETA +
               '> Channel verfügbar',
            ephemeral: true,
         });
      }

      if (!mainChannel.isText()) {
         return interaction.reply({
            content: 'Dieser command ist nur im Text Channel verfügbar',
            ephemeral: true,
         });
      }

      if (dbThread.userid !== interaction.user.id) {
         return interaction.reply({
            content: 'Nur der Ersteller des Threads kann den Thread promoten',
            ephemeral: true,
         });
      }

      const member = await bot.getMember(dbThread.userid);
      if (!member) {
         return interaction.reply({
            content: 'Ich konnte den Ersteller des Threads nicht finden',
            ephemeral: true,
         });
      }

      await mainChannel.send({
         content:
            '<@&' +
            process.env.MENTION_DEVELOPER_ROLE_ID +
            '>, <@' +
            member.user.id +
            '> (' +
            member.user.tag +
            ') benötigt hilfe in <#' +
            dbThread.id +
            '>',
      });

      await prisma.helpThread.update({
         where: {
            id: channel.id,
         },
         data: {
            ispromoted: true,
         },
      });

      return interaction.reply({
         content:
            'Der Kanal wurde nun in <#' +
            process.env.DISCORD_CODING_BETA +
            '> promotet',
      });
   },
});
