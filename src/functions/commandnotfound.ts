import { MessageEmbed } from 'discord.js';
import { bot } from '..';
import { Function } from '../Structures/Function';

export default new Function({
   name: 'commandnotfound',
   execute: ({}) => {
      return new MessageEmbed()
         .setTitle('> Fehler')
         .setColor(bot.colors.red)
         .setDescription('Dieser Befehl existiert nicht.')
         .setFooter(bot.footer)
         .setTimestamp();
   },
});
