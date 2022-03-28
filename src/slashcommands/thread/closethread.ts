import { Permissions } from 'discord.js';
import { bot } from '../..';
import { updateThreadNotifyMessage } from '../../modules/codingtreads';
import prisma from '../../prisma/client';
import { SlashCommand } from '../../Structures/SlashCommand';

export default new SlashCommand({
   name: 'closethread',
   description: 'Schließt einen Thread',
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

      if (
         dbThread.userid !== interaction.user.id &&
         !interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
      ) {
         return interaction.reply({
            content: 'Du hast keine Berechtigung diesen Thread zu schließen',
            ephemeral: true,
         });
      }

      if (dbThread.closed) {
         return interaction.reply({
            content: 'Dieser Thread ist bereits geschlossen',
            ephemeral: true,
         });
      }

      await prisma.helpThread.update({
         where: {
            id: channel.id,
         },
         data: {
            closed: true,
         },
      });

      setTimeout(() => {
         channel.delete().then(() => {
            updateThreadNotifyMessage();
         });
      }, 10000);

      return interaction.reply({
         content: 'Der Thread wird in 10 Sekunden geschlossen',
      });
   },
});
