import axios from 'axios';
import { MessageEmbed, MessageReaction } from 'discord.js';
import { bot } from '..';
import { codeExecutionEmoji } from '../config/emojis';
import { languages } from '../data/codeexec/languages';
import { Event } from '../Structures/Event';
import { executeCode } from '../utils/executecode';

export default new Event('messageReactionAdd', async (reaction, user) => {
   if (user.bot || !reaction) return;
   if (
      reaction.message.channelId === process.env.RULES_CHANNEL_ID &&
      reaction.emoji.name === '👍'
   ) {
      const msg = await bot.getMessage(
         reaction.message.id,
         reaction.message.channelId,
      );
      if (!msg) return;

      const guildMember = await bot.getMember(user.id);
      if (!guildMember) return;

      guildMember.roles.add(process.env.DEVELOPER_ROLE_ID).catch(console.error);
   } else if (
      reaction.message.channelId === process.env.GET_ROLES_CHANNEL_ID &&
      (reaction.emoji.id === process.env.DEVELOPER_EMOJI_ID ||
         reaction.emoji.id === process.env.MENTION_DEVELOPER_EMOJI_ID)
   ) {
      const msg = await bot.getMessage(
         reaction.message.id,
         reaction.message.channelId,
      );
      if (!msg) return;

      if (reaction.emoji.id === process.env.DEVELOPER_EMOJI_ID) {
         const guildMember = await bot.getMember(user.id);
         if (!guildMember) return;

         guildMember.roles
            .add(process.env.DEVELOPER_ROLE_ID)
            .catch(console.error);
      } else if (reaction.emoji.id === process.env.MENTION_DEVELOPER_EMOJI_ID) {
         const guildMember = await bot.getMember(user.id);
         if (!guildMember) return;

         guildMember.roles
            .add(process.env.MENTION_DEVELOPER_ROLE_ID)
            .catch(console.error);
      }
   } else if (
      (reaction.emoji.name === codeExecutionEmoji &&
         reaction.count &&
         reaction.count > 1 &&
         reaction.count < 2 &&
         reaction.users.cache.find((u) => u.id === bot.user?.id)) ||
      (await reaction.users.fetch()).find((u) => u.id === bot.user?.id)
   ) {
      const msg = await (reaction as MessageReaction).message.fetch();
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
            const codeMsg = await (reaction as MessageReaction).message.reply(
               'Executing...',
            );
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
               if (executed.stdout.length > 3000) {
                  let err = false;
                  const haste = await axios
                     .post(
                        'https://uploads.mxgnus.de/api/haste/new',
                        {
                           haste: executed.stdout,
                        },
                        {
                           headers: {
                              Authorization: process.env.UPLOAD_KEY,
                           },
                        },
                     )
                     .catch((error) => {
                        err = true;
                     });
                  if (err || !haste || !haste.data || !haste.data.url) {
                     return codeMsg.edit('Es ist ein Fehler aufgetreten');
                  }

                  const embed = new MessageEmbed()
                     .setTitle('Ausgabe')
                     .setDescription(
                        '**Code**\n' +
                           '```' +
                           code[0].toLowerCase() +
                           '\n' +
                           parsedCode +
                           '\n```\n\n' +
                           '**Stdout**: [Haste](' +
                           haste.data.url +
                           ')',
                     )
                     .setColor('#00ff00')
                     .setFooter({
                        text: `${lang.toUpperCase()} | Ausgeführt in ${
                           executed.exectimems
                        }ms`,
                     });
                  return codeMsg.edit({
                     content: null,
                     embeds: [embed],
                  });
               }
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
