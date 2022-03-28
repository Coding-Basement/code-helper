import { MessageEmbed } from 'discord.js';
import { bot } from '..';

export default function commandNotFound() {
   return new MessageEmbed()
      .setTitle('> Fehler')
      .setColor(bot.colors.red)
      .setDescription('Dieser Befehl existiert nicht.')
      .setFooter(bot.footer)
      .setTimestamp();
}
