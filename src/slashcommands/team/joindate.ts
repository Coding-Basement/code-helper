import { bot } from '../..';
import { SlashCommand } from '../../Structures/SlashCommand';

export default new SlashCommand({
   name: 'joindate',
   description: 'Zeigt an, wann ein User dem Server beigetreten ist',
   options: [
      {
         name: 'user',
         type: 'USER',
         required: true,
         description: 'Der User, dessen Eintrittsdatum angezeigt werden soll',
      },
   ],
   permission: 'ADMINISTRATOR',
   execute: async ({ interaction, args }) => {
      const user = args.getUser('user', true);
      const member = await bot.getMember(user.id);
      if (!member)
         return interaction.reply(
            `${user.username} ist nicht in diesem Server.`,
         );
      const joinedAt = member.joinedAt;
      if (!joinedAt)
         return interaction.reply(
            `${user.username} ist noch nicht beigetreten.`,
         );
      const joinedAtDate = '<t:' + Math.floor((joinedAt as any) / 1000) + ':f>';

      await interaction.reply({
         content: `${user.username} ist dem Server beigetreten am ${joinedAtDate}`,
         ephemeral: true,
      });
   },
});
