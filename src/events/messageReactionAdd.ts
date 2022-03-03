import { bot } from '..';
import { Event } from '../Structures/Event';

export default new Event('messageReactionAdd', async (reaction, user) => {
   const { message, emoji } = reaction;

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
   }
});
