import {
   CommandInteractionOptionResolver,
   Interaction,
   MessageEmbed,
   Permissions,
} from 'discord.js';
import { bot } from '..';
import { Event } from '../Structures/Event';
import { ExtendedInteraction } from '../types/SlashCommand';
import discordModals, {
   Modal,
   showModal,
   TextInputComponent,
} from 'discord-modals';
import prisma from '../prisma/client';
discordModals(bot);

export default new Event('interactionCreate', async (interaction) => {
   if (interaction.isCommand()) {
      const command = bot.slashCommands.get(interaction.commandName);
      if (!command) {
         return interaction.reply({
            ephemeral: true,
            embeds: [bot.functions.get('commandnotfound')?.execute({})],
         });
      }

      if (command.permission) {
         if (!interaction.memberPermissions?.has(command.permission)) {
            return interaction.reply({
               ephemeral: true,
               embeds: [
                  bot.functions.get('nopermission')?.execute({
                     permission: command.permission,
                  }),
               ],
            });
         }
      }

      command.execute({
         interaction: interaction as ExtendedInteraction,
         args: interaction.options as CommandInteractionOptionResolver,
      });
   } else if (interaction.isButton()) {
      return handleButtons(interaction);
   }
});

async function handleButtons(interaction: Interaction) {
   if (!interaction.isButton()) return;
   if (interaction.customId === 'apply-accept') {
      if (
         !interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)
      ) {
         return interaction.reply({
            content: 'Du hast keine Berechtigung, diesen Befehl auszuführen.',
            ephemeral: true,
         });
      }
      const { id: msgId } = interaction.message;
      if (!msgId) return;
      const application = await prisma.application.findUnique({
         where: {
            messageid: msgId,
         },
      });

      if (!application)
         return interaction.reply({
            content:
               '<@' +
               interaction.user.id +
               '>, diese Bewerbung existiert nicht.',
            ephemeral: true,
         });

      if (application.accepted)
         return interaction.reply({
            content:
               '<@' +
               interaction.user.id +
               '>, diese Bewerbung wurde bereits akzeptiert.',
            ephemeral: true,
         });

      if (application.declined)
         return interaction.reply({
            content:
               '<@' +
               interaction.user.id +
               '>, diese Bewerbung wurde bereits abgelehnt.',
            ephemeral: true,
         });

      if (application.closed)
         return interaction.reply({
            content:
               '<@' +
               interaction.user.id +
               '>, diese Bewerbung wurde bereits geschlossen.',
            ephemeral: true,
         });

      const member = await bot.getMember(application.userid);
      if (!member)
         return interaction.reply({
            content:
               '<@' +
               interaction.user.id +
               '>, dieser Benutzer existiert nicht.',
            ephemeral: true,
         });

      const memberEmbed = new MessageEmbed()
         .setTitle('Bewerbung akzeptiert')
         .setDescription(
            'Deine Bewerbung als **' +
               application.position +
               '** wurde von **' +
               interaction.user.tag +
               '** (' +
               interaction.user.id +
               ') akzeptiert.',
         )
         .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
         })
         .setTimestamp()
         .setColor(bot.colors.green);

      await member
         .send({
            embeds: [memberEmbed],
         })
         .then(async () => {
            await prisma.application.update({
               where: {
                  id: application.id,
               },
               data: {
                  accepted: true,
                  closed: true,
               },
            });
            return interaction.reply({
               content:
                  '<@' +
                  interaction.user.id +
                  '>, du hast die Bewerbung akzeptiert.',
            });
         })
         .catch(async (err) => {
            await prisma.application.update({
               where: {
                  id: application.id,
               },
               data: {
                  accepted: true,
                  closed: true,
               },
            });
            return interaction.reply({
               content:
                  '<@' +
                  interaction.user.id +
                  '>, du hast die Bewerbung akzeptiert, jedoch konnte ihm keine Nachricht zugestellt werden.',
            });
         });
   } else if (interaction.customId === 'apply-decline') {
      if (
         !interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)
      ) {
         return interaction.reply({
            content: 'Du hast keine Berechtigung, diesen Befehl auszuführen.',
            ephemeral: true,
         });
      }
      const { id: msgId } = interaction.message;
      if (!msgId) return;
      const application = await prisma.application.findUnique({
         where: {
            messageid: msgId,
         },
      });

      if (!application)
         return interaction.reply({
            content:
               '<@' +
               interaction.user.id +
               '>, diese Bewerbung existiert nicht.',
            ephemeral: true,
         });

      if (application.accepted)
         return interaction.reply({
            content:
               '<@' +
               interaction.user.id +
               '>, diese Bewerbung wurde bereits akzeptiert.',
            ephemeral: true,
         });

      if (application.declined)
         return interaction.reply({
            content:
               '<@' +
               interaction.user.id +
               '>, diese Bewerbung wurde bereits abgelehnt.',
            ephemeral: true,
         });

      if (application.closed)
         return interaction.reply({
            content:
               '<@' +
               interaction.user.id +
               '>, diese Bewerbung wurde bereits geschlossen.',
            ephemeral: true,
         });

      const member = await bot.getMember(application.userid);
      if (!member)
         return interaction.reply({
            content:
               '<@' +
               interaction.user.id +
               '>, dieser Benutzer existiert nicht.',
            ephemeral: true,
         });

      const modal = new Modal()
         .setCustomId('modal-apply-decline:' + application.id)
         .setTitle('Bewerbung abgelehnt')
         .addComponents(
            new TextInputComponent()
               .setLabel('Grund')
               .setPlaceholder('Grund')
               .setRequired(true)
               .setStyle('LONG')
               .setCustomId('modal-apply-decline-reason'),
         );

      return showModal(modal, {
         interaction: interaction,
         client: bot,
      });
   }
}
