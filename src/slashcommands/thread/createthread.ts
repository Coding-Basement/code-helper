import { Modal, showModal, TextInputComponent } from 'discord-modals';
import { bot } from '../..';
import { SlashCommand } from '../../Structures/SlashCommand';

export default new SlashCommand({
   name: 'createthread',
   description: 'Erstelle einen neuen Thread für dein Coding Problem',
   execute: async ({ interaction, args }) => {
      if (interaction.channelId !== process.env.DISCORD_CODING_BETA)
         return interaction.reply({
            content:
               'Dieser command ist nur im <#' +
               process.env.DISCORD_CODING_BETA +
               '> Channel verfügbar',
            ephemeral: true,
         });

      const name = new TextInputComponent()
         .setLabel('Thema')
         .setStyle('SHORT')
         .setCustomId('modal-createthread-name')
         .setRequired(true)
         .setPlaceholder('Fasse dein Problem kurz zusammen')
         .setMinLength(5)
         .setMaxLength(30);
      const problem = new TextInputComponent()
         .setLabel('Wie lautet dein Problem?')
         .setMinLength(50)
         .setCustomId('modal-createthread-problem')
         .setStyle('LONG')
         .setRequired(true)
         .setPlaceholder(
            'Wie lautet dein problem? (genaue Beschreibung des Problems)',
         )
         .setMaxLength(1000);
      const nodeversion = new TextInputComponent()
         .setLabel('Welche Node Version benutzt du?')
         .setStyle('SHORT')
         .setRequired(true)
         .setCustomId('modal-createthread-nodeversion')
         .setPlaceholder('Node Version (node -v)')
         .setMaxLength(50);
      const additional = new TextInputComponent()
         .setLabel('Hier kommen zusätzliche Informationen rein')
         .setStyle('LONG')
         .setRequired(false)
         .setCustomId('modal-createthread-additional')
         .setPlaceholder('Hier kommen zusätzliche Informationen rein')
         .setMaxLength(1000);

      const modal = new Modal()
         .setCustomId('modal-createthread')
         .setTitle('Thread erstellen')
         .addComponents(name, problem, nodeversion, additional);

      return showModal(modal, {
         client: bot,
         interaction,
      });
   },
});
