import { MessageCommand } from '../../Structures/MessageCommand';

export default new MessageCommand({
   name: 'code',
   description: 'Formattiere deinen Code',
   category: 'codehelper',
   execute: async ({ message, args }) => {
      const codelanguage = args[0];
      const code = args.slice(1).join(' ');

      if (!codelanguage) {
         return message.reply(
            "Bitte gebe eine Language an, z.B. `code js console.log('Hi!');`",
         );
      }

      if (!code) {
         return message.reply(
            "Bitte gebe einen Code an, z.B. `code js console.log('Hi!');`",
         );
      }

      message.delete();
      message.channel.send(`\`\`\`${codelanguage}\n${code}\n\`\`\``);
   },
});
