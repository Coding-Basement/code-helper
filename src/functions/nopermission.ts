import { MessageEmbed } from 'discord.js';
import { bot } from '..';

export default function noPermission({ permission }: { permission: string }) {
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
}
