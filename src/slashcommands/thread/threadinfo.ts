import { MessageEmbed } from 'discord.js';
import { bot } from '../..';
import prisma from '../../prisma/client';
import { SlashCommand } from '../../Structures/SlashCommand';

export default new SlashCommand({
   name: 'threadinfo',
   description: 'Zeigt Informationen zu einem Thread an',
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

      const member = await bot.getMember(dbThread.userid);

      if (!member) {
         return interaction.reply({
            content: 'Der ersteller des Threads konnte nicht gefunden werden',
            ephemeral: true,
         });
      }

      const embed = new MessageEmbed()
         .setTitle('Thread Informationen')
         .setAuthor({
            name: 'Erstellt von ' + member.user.tag,
            iconURL: member.user.displayAvatarURL(),
         })
         .setDescription(
            '**Thema:** `' +
               dbThread.title +
               '`' +
               '\n**Node Version:** `' +
               dbThread.nodeversion +
               '`' +
               '\n\n**Problem**:' +
               '```\n' +
               dbThread.problem +
               '\n```' +
               '\n\n**Weitere Informationen**:' +
               '\n```\n' +
               (dbThread.additionalinformations ?? 'N/A') +
               '\n```',
         )
         .setColor(bot.colors.light_blue)
         .setTimestamp();

      return interaction.reply({ embeds: [embed] });
   },
});
