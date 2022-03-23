import { MessageEmbed } from 'discord.js';
import { bot } from '../..';
import { getConfig } from '../../prisma/client';
import { SlashCommand } from '../../Structures/SlashCommand';

export default new SlashCommand({
   name: 'applystatus',
   description: 'Bekomme den Status der Bewerbungsphase',
   execute: async ({ interaction, args }) => {
      const applyConfig = await getConfig('applystatus');
      if (!applyConfig || !applyConfig.value) {
         const embed = new MessageEmbed()
            .setTitle('Bewerbungsphase')
            .setDescription('Die Bewerbungsphase ist momentan nicht aktiv.')
            .setColor(bot.colors.red);
         return interaction.reply({
            embeds: [embed],
         });
      } else {
         const embed = new MessageEmbed()
            .setTitle('Bewerbungsphase')
            .setDescription('Die Bewerbungsphase ist momentan aktiv.')
            .setColor(bot.colors.green);
         return interaction.reply({
            embeds: [embed],
         });
      }
   },
});
