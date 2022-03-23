import { Modal, showModal, TextInputComponent } from 'discord-modals';
import { MessageEmbed } from 'discord.js';
import { bot } from '../..';
import { getConfig } from '../../prisma/client';
import { SlashCommand } from '../../Structures/SlashCommand';

export default new SlashCommand({
   name: 'bewerben',
   description: 'Bewerbe dich für das Team',
   execute: async ({ interaction, args }) => {
      const applyStatusConfig = await getConfig('applystatus');
      if (!applyStatusConfig || !applyStatusConfig.value) {
         const embed = new MessageEmbed()
            .setTitle('Bewerbungsphase')
            .setDescription('Die Bewerbungsphase ist momentan nicht aktiv.')
            .setColor(bot.colors.red);
         return interaction.reply({
            embeds: [embed],
            ephemeral: true,
         });
      }

      const nameAndAge = new TextInputComponent()
         .setCustomId('modal-apply-name-age')
         .setLabel('Wie heißt du?/Wie alt bist du?')
         .setStyle('SHORT')
         .setRequired(true)
         .setMinLength(1)
         .setMaxLength(100)
         .setPlaceholder('Max Mustermann, 32');

      const positionComponent = new TextInputComponent()
         .setCustomId('modal-apply-position')
         .setLabel('Als welche Position bewirbst du dich?')
         .setStyle('LONG')
         .setRequired(true)
         .setMinLength(1)
         .setMaxLength(20)
         .setPlaceholder('Administrator/Moderator');

      const mainQuestionComponent = new TextInputComponent()
         .setCustomId('modal-apply-main')
         .setLabel('Warum möchtest du bei uns bewerben?')
         .setStyle('LONG')
         .setRequired(true)
         .setMinLength(100)
         .setMaxLength(500)
         .setPlaceholder('Warum möchtest du bei uns bewerben?');

      const discordComponent = new TextInputComponent()
         .setCustomId('modal-apply-discord')
         .setLabel('Wie hast du den Discord Server gefunden?')
         .setStyle('LONG')
         .setRequired(true)
         .setMinLength(1)
         .setMaxLength(500)
         .setPlaceholder('Wie hast du den Discord Server gefunden?');

      const additionalComponent = new TextInputComponent()
         .setCustomId('modal-apply-additional')
         .setLabel('Zusätzliche Informationen')
         .setStyle('LONG')
         .setMinLength(1)
         .setMaxLength(500)
         .setRequired(false)
         .setPlaceholder('Schreibe hier zusätzliche Informationen über dich');

      const applyModal = new Modal()
         .setCustomId('modal-apply')
         .setTitle('Bewerbe dich für das Team')
         .addComponents(
            nameAndAge,
            positionComponent,
            mainQuestionComponent,
            discordComponent,
            additionalComponent,
         );

      return showModal(applyModal, {
         interaction,
         client: bot,
      });
   },
});
