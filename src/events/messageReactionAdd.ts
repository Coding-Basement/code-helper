import axios from 'axios';
import { MessageEmbed } from 'discord.js';
import { bot } from '..';
import { codeExecutionEmoji } from '../config/emojis';
import { languages } from '../data/codeexec/languages';
import { Event } from '../Structures/Event';
import { executeCode } from '../utils/executecode';

export default new Event('messageReactionAdd', async (reaction, user) => {
   const { message, emoji, users } = reaction;
   if (user.bot) return;
   if (
      message.channelId === process.env.RULES_CHANNEL_ID &&
      emoji.name === '👍'
   ) {
      const msg = await bot.getMessage(message.id, message.channelId);
      if (!msg || !msg.author.bot) return;
      const guildMember = await bot.getMember(user.id);
      if (!guildMember) return;
      guildMember.roles.add(process.env.DEFAULT_ROLE_ID);
   } else if (
      message.channelId === process.env.GET_ROLES_CHANNEL_ID &&
      (emoji.id === process.env.DEVELOPER_EMOJI_ID ||
         emoji.id === process.env.MENTION_DEVELOPER_EMOJI_ID)
   ) {
      const msg = await bot.getMessage(message.id, message.channelId);
      if (!msg || !msg.author.bot) return;
      if (emoji.id === process.env.DEVELOPER_EMOJI_ID) {
         const guildMember = await bot.getMember(user.id);
         if (!guildMember) return;
         guildMember.roles.add(process.env.DEVELOPER_ROLE_ID).catch(() => {});
      } else if (emoji.id === process.env.MENTION_DEVELOPER_EMOJI_ID) {
         const guildMember = await bot.getMember(user.id);
         if (!guildMember) return;
         guildMember.roles
            .add(process.env.MENTION_DEVELOPER_ROLE_ID)
            .catch(() => {});
      }
   } else if (
      (emoji.name === codeExecutionEmoji &&
         reaction.count &&
         reaction.count > 1 &&
         reaction.count < 2 &&
         users.cache.find((u) => u.id === bot.user?.id)) ||
      (await users.fetch()).find((u) => u.id === bot.user?.id)
   ) {
      const msg = await message.fetch();
      if (msg.content.startsWith('```') && msg.content.endsWith('```')) {
         const parsedMsg = msg.content.slice(3, -3);
         const code = parsedMsg.split('\n');
         const parsedCode = code.slice(1).join('\n');
         const languageKeys = Object.keys(languages);
         let lang = null;
         for (const key of languageKeys) {
            if (key === code[0]?.toLowerCase()) {
               lang = languages[key];
               break;
            }
         }
         if (lang) {
            const codeMsg = await message.reply('Executing...');
            const executed = await executeCode({
               language: lang,
               code: parsedCode,
            });

            if (!executed)
               return codeMsg.edit('Es ist ein Fehler aufgetreten.');
            if (executed.stderr) {
               const embed = new MessageEmbed()
                  .setTitle('Fehler')
                  .setDescription(
                     '**Code**\n' +
                        '```' +
                        code[0].toLowerCase() +
                        '\n' +
                        parsedCode +
                        '\n```\n\n' +
                        '**Stderr**\n```' +
                        code[0].toLowerCase() +
                        '\n' +
                        executed.stderr +
                        '\n```',
                  )
                  .setColor('#ff0000')
                  .setFooter({
                     text: `${lang.toUpperCase()} | Ausgeführt in ${
                        executed.exectimems
                     }ms`,
                  });
               codeMsg.edit({
                  content: null,
                  embeds: [embed],
               });
            } else {
               const embed = new MessageEmbed()
                  .setTitle('Ergebnis')
                  .setDescription(
                     '**Code**\n' +
                        '```' +
                        code[0].toLowerCase() +
                        '\n' +
                        parsedCode +
                        '\n```\n\n' +
                        '**Stdout**\n```' +
                        code[0].toLowerCase() +
                        '\n' +
                        executed.stdout +
                        '\n```',
                  )
                  .setFooter({
                     text: `${lang.toUpperCase()} | Ausgeführt in ${
                        executed.exectimems
                     }ms`,
                  })
                  .setColor('#00ff00');
               codeMsg.edit({
                  content: null,
                  embeds: [embed],
               });
            }
         }
      }
   }
});
