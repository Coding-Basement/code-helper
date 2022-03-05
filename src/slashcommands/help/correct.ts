import { SlashCommand } from '../../Structures/SlashCommand';

export default new SlashCommand({
   name: 'correct',
   description: 'Korrigiere den Code von jemand anderem',
   options: [
      {
         name: 'wrong',
         type: 'STRING',
         required: true,
         description: 'Der falsche Code',
      },
      {
         name: 'right',
         type: 'STRING',
         required: true,
         description: 'Der richtige Code',
      },
   ],
   execute: async ({ interaction, args }) => {
      const wrong = args.getString('wrong', true);
      const right = args.getString('right', true);

      if (wrong === right) {
         return interaction.reply({
            content:
               'Du musst einen Code eingeben, der nicht gleich dem richtigen Code ist.',
            ephemeral: true,
         });
      }

      return interaction.reply({
         content: '```diff\n- ' + wrong + '\n\n+ ' + right + '\n```',
      });
   },
});
