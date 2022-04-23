import { SlashCommand } from '../../Structures/SlashCommand';

export default new SlashCommand({
   name: 'testcmd',
   description: 'A test command.',
   permission: 'ADMINISTRATOR',
   execute: async ({ interaction, args }) => {
      interaction.reply('Test command executed.');
   },
});
