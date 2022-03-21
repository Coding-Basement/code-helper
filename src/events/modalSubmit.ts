import { Event } from '../Structures/Event';
import { ModalSubmitInteraction } from 'discord-modals';
import { bot } from '..';
import {
   GuildTextBasedChannel,
   MessageActionRow,
   MessageButton,
   MessageEmbed,
   Permissions,
} from 'discord.js';
import prisma from '../prisma/client';

export default new Event(
   'modalSubmit' as any,
   async (modal: ModalSubmitInteraction) => {
      if (modal.customId === 'modal-apply') {
         const nameAndAge = modal.getTextInputValue('modal-apply-name-age');
         const position = modal.getTextInputValue('modal-apply-position');
         const mainQuestion = modal.getTextInputValue('modal-apply-main');
         const discord = modal.getTextInputValue('modal-apply-discord');
         const additional = modal.getTextInputValue('modal-apply-additional');

         const channel = (await bot.getChannel(
            process.env.CHANNEL_APPLICATIONS,
         )) as GuildTextBasedChannel;
         const embed = new MessageEmbed()
            .setAuthor({
               name: modal.member.user.tag,
               iconURL: modal.member.displayAvatarURL(),
            })
            .setTitle('Bewerbung von ' + modal.member.user.tag)
            .addFields([
               {
                  name: 'Name und Alter',
                  value: nameAndAge ?? 'Nichts angegeben',
               },
               {
                  name: 'Position',
                  value: position ?? 'Nichts angegeben',
               },
               {
                  name: 'Warum möchtest du bei uns bewerben?',
                  value: mainQuestion ?? 'Nichts angegeben',
               },
               {
                  name: 'Wie hast du den Discord Server gefunden?',
                  value: discord ?? 'Nichts angegeben',
               },
               {
                  name: 'Zusätzliche Informationen',
                  value: additional ?? 'Nichts angegeben',
               },
            ])
            .setTimestamp()
            .setColor(bot.colors.light_blue);

         const acceptButton = new MessageButton()
            .setCustomId('apply-accept')
            .setEmoji('✅')
            .setStyle('SUCCESS')
            .setLabel('Annehmen');
         const declineButton = new MessageButton()
            .setCustomId('apply-decline')
            .setEmoji('❌')
            .setStyle('DANGER')
            .setLabel('Ablehnen');

         const row = new MessageActionRow().addComponents(
            acceptButton,
            declineButton,
         );

         const msg = await channel.send({
            embeds: [embed],
            components: [row],
         });
         await prisma.application.create({
            data: {
               userid: modal.member.id,
               nameandage: nameAndAge ?? 'Nichts angegeben',
               position: position ?? 'Nichts angegeben',
               mainquestion: mainQuestion ?? 'Nichts angegeben',
               discordquestion: discord ?? 'Nichts angegeben',
               additionalinformations: additional ?? 'Nichts angegeben',
               messageid: msg.id,
            },
         });

         await modal.deferReply({
            ephemeral: true,
         });
         return modal.followUp({
            content:
               'Deine Bewerbung als ' +
               position +
               ' wurde erfolgreich gesendet!',
            ephemeral: true,
         });
      } else if (modal.customId.startsWith('modal-apply-decline:')) {
         if (!modal.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)) {
            await modal.deferReply({
               ephemeral: true,
            });
            return modal.followUp({
               content: 'Du hast keine Berechtigung, diesen Befehl auszuführen',
               ephemeral: true,
            });
         }
         const reason =
            modal.getTextInputValue('modal-apply-decline-reason') ??
            'Keine Begründung angegeben';
         const applicationId = modal.customId.split(':')[1];
         const application = await prisma.application.findUnique({
            where: {
               id: parseInt(applicationId),
            },
         });

         if (!application) {
            await modal.deferReply({
               ephemeral: true,
            });
            return modal.followUp({
               content: 'Diese Bewerbung existiert nicht',
               ephemeral: true,
            });
         }

         if (application.accepted) {
            await modal.deferReply({
               ephemeral: true,
            });
            return modal.followUp({
               content:
                  '<@' +
                  modal.user.id +
                  '>, diese Bewerbung wurde bereits akzeptiert.',
            });
         }
         if (application.declined) {
            await modal.deferReply({
               ephemeral: true,
            });
            return modal.followUp({
               content:
                  '<@' +
                  modal.user.id +
                  '>, diese Bewerbung wurde bereits abgelehnt.',
            });
         }

         if (application.closed) {
            await modal.deferReply({
               ephemeral: true,
            });
            return modal.followUp({
               content:
                  '<@' +
                  modal.user.id +
                  '>, diese Bewerbung wurde bereits geschlossen.',
            });
         }

         const member = await bot.getMember(modal.user.id);

         if (!member) {
            await modal.deferReply({
               ephemeral: true,
            });
            return modal.followUp({
               content:
                  '<@' + modal.user.id + '>, dieser Benutzer existiert nicht.',
            });
         }

         const memberEmbed = new MessageEmbed()
            .setTitle('Bewerbung abgelehnt')
            .setDescription(
               'Deine Bewerbung als **' +
                  application.position +
                  '** wurde von **' +
                  modal.user.tag +
                  '** (' +
                  modal.user.id +
                  ') abgelehnt.',
            )
            .addField('Begründung', reason)
            .setAuthor({
               name: modal.user.tag,
               iconURL: modal.user.displayAvatarURL(),
            })
            .setTimestamp()
            .setColor(bot.colors.red);

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
                     declined: true,
                     closed: true,
                  },
               });
               return modal.reply({
                  content:
                     '<@' +
                     modal.user.id +
                     '>, du hast die Bewerbung abgelehnt.',
               });
            })
            .catch(async (err) => {
               await prisma.application.update({
                  where: {
                     id: application.id,
                  },
                  data: {
                     declined: true,
                     closed: true,
                  },
               });
               return modal.reply({
                  content:
                     '<@' +
                     modal.user.id +
                     '>, du hast die Bewerbung abgelehnt, jedoch konnte ihm keine Nachricht zugestellt werden.',
               });
            });
      }
   },
);