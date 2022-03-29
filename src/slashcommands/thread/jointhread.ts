import { bot } from '../..';
import prisma from '../../prisma/client';
import { SlashCommand } from '../../Structures/SlashCommand';

export default new SlashCommand({
   name: 'jointhread',
   description: 'Trette einen Thread bei',
   options: [
      {
         name: 'threadid',
         description: 'Die Id des Threads',
         type: 'NUMBER',
         required: true,
         autocomplete: true,
      },
   ],
   execute: async ({ interaction, args }) => {
      const threadId = args.getNumber('threadid', true);
      const dbThead = await prisma.helpThread.findUnique({
         where: {
            countid: threadId,
         },
      });

      if (!dbThead) {
         return interaction.reply({
            content: 'Der Thread mit der Id `' + threadId + '` exestier nicht!',
            ephemeral: true,
         });
      }

      const channel = await bot.getChannel(process.env.DISCORD_CODING_BETA);
      if (!channel) {
         return interaction.reply({
            content: 'Etwas ist schief gelaufen!',
            ephemeral: true,
         });
      }

      if (!channel.isText() || channel.isThread()) {
         return interaction.reply({
            content: 'Etwas ist schief gelaufen!',
            ephemeral: true,
         });
      }

      const thread = await channel.threads.fetch(dbThead.id).catch(() => null);
      if (!thread || !thread.isThread()) {
         return interaction.reply({
            content: 'Etwas ist schief gelaufen!',
            ephemeral: true,
         });
      }

      const isThreadMember = await thread.members
         .fetch(interaction.user.id)
         .catch(() => null);

      if (isThreadMember) {
         return interaction.reply({
            content: 'Du bist bereits in dem Thread!',
            ephemeral: true,
         });
      }

      const threadMember = await thread.members
         .add(interaction.user.id)
         .catch(() => null);

      if (!threadMember) {
         return interaction.reply({
            content: 'Ich konnte dich nicht in den Thread hintzfügen!',
            ephemeral: true,
         });
      } else {
         return interaction.reply({
            content: 'Du bist dem Thread <#' + thread.id + '> beigetreten!',
            ephemeral: true,
         });
      }
   },
});
