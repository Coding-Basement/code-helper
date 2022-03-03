import { MessageEmbed } from 'discord.js';
import { bot } from '..';
import { Function } from '../Structures/Function';

export default new Function({
   name: 'nopermission',
   execute: ({ permission }: { permission: string }) => {
      return new MessageEmbed()
         .setTitle('> Fehler')
         .setColor(bot.colors.red)
         .setDescription(
            'Du hast nicht genügend Permissions um diesen Command auszuführen.\nBenötigte Permissions: `' +
               permission.toUpperCase() +
               '`',
         )
         .setFooter(bot.footer)
         .setTimestamp();
   },
});
