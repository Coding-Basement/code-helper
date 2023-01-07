import { bot } from '..';
import { Event } from '../Structures/Event';

export default new Event('messageReactionRemove', async (reaction, user) => {
   const { message, emoji } = reaction;

   if (
      message.channelId === process.env.GET_ROLES_CHANNEL_ID &&
      (emoji.id === process.env.DEVELOPER_EMOJI_ID ||
         emoji.id === process.env.MENTION_DEVELOPER_EMOJI_ID)
   ) {
      const msg = await bot.getMessage(message.id, message.channelId);
      if (!msg) return;
      if (emoji.id === process.env.DEVELOPER_EMOJI_ID) {
         const roleId = process.env.DEVELOPER_ROLE_ID;
         const guildMember = await bot.getMember(user.id);
         if (!guildMember) return;
         guildMember.roles.remove(roleId).catch(() => console.error);
      } else if (emoji.id === process.env.MENTION_DEVELOPER_EMOJI_ID) {
         const guildMember = await bot.getMember(user.id);
         if (!guildMember) return;
         const roleId = process.env.MENTION_DEVELOPER_ROLE_ID;
         guildMember.roles.remove(roleId).catch(() => console.error);
      }
   }
});
