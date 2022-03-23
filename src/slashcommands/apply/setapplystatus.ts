import { MessageEmbed } from 'discord.js';
import { bot } from '../..';
import prisma from '../../prisma/client';
import { SlashCommand } from '../../Structures/SlashCommand';

export default new SlashCommand({
   name: 'setapplystatus',
   description: 'Setzt den Status der Bewerbungsphase',
   options: [
      {
         name: 'status',
         description:
            'Soll die Bewerbungsphase aktiviert oder deaktiviert werden?',
         required: true,
         type: 'BOOLEAN',
      },
   ],
   permission: 'ADMINISTRATOR',
   execute: async ({ interaction, args }) => {
      const status = args.getBoolean('status', true);
      await prisma.config.upsert({
         where: {
            name: 'applystatus',
         },
         create: {
            name: 'applystatus',
            value: status,
         },
         update: {
            name: 'applystatus',
            value: status,
         },
      });

      const embed = new MessageEmbed()
         .setTitle('Bewerbungsphase')
         .setDescription(
            `Die Bewerbungsphase ist nun ${
               status ? 'aktiviert' : 'deaktiviert'
            }.`,
         )
         .setColor(bot.colors.green);

      return interaction.reply({
         embeds: [embed],
      });
   },
});
