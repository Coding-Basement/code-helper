import { SlashCommand } from '../../Structures/SlashCommand';
import { docs } from '../../data/docs/docs';
import { capitalizeFirstLetter } from '../../utils/strings';
import { ApplicationCommandOptionData, MessageEmbed } from 'discord.js';
import { bot } from '../..';

const slashcommandOptions: ApplicationCommandOptionData[] = [];
for (const doc of docs) {
   slashcommandOptions.push({
      name: doc.name,
      description: doc.description,
      type: 'SUB_COMMAND',
      options: [
         {
            name: 'documentation',
            description: 'Wähle das Thema der Documentation aus',
            type: 'STRING',
            required: true,
            choices: doc.options.map((option) => {
               return {
                  name: option.name,
                  value: option.name,
               };
            }),
         },
      ],
   });
}

slashcommandOptions.push({
   name: 'search',
   description: 'Suche nach einer Documentation',
   type: 'SUB_COMMAND',
   options: [
      {
         name: 'query',
         description: 'Suchbegriff',
         type: 'STRING',
         required: true,
      },
   ],
});

export default new SlashCommand({
   name: 'docs',
   description: 'Zeigt die Dokumentation für verschiedene Sachen an',
   options: slashcommandOptions,
   execute: async ({ interaction, args }) => {
      const documentationGroup = args.getSubcommand(true);
      const documentation = args.getString('documentation', false);

      if (documentationGroup === 'search') {
         const query = args.getString('query', false)?.toLowerCase();
         if (!query) {
            return interaction.reply('Du musst einen Suchbegriff angeben.');
         }

         const results: {
            name: string;
            url: string;
            category: string;
         }[] = [];

         for (const doc of docs) {
            for (const option of doc.options) {
               if (
                  option.name.toLowerCase().includes(query) ||
                  option.name.toLowerCase().startsWith(query) ||
                  option.url.toLowerCase().includes(query) ||
                  option.name
                     .toLowerCase()
                     .split('-')
                     .join('')
                     .includes(query.split('-').join('').split(' ').join(''))
               ) {
                  results.push({
                     ...option,
                     category: doc.name,
                  });
               }
            }
         }

         if (results.length === 0) {
            return interaction.reply('Es wurden keine Ergebnisse gefunden.');
         } else {
            const resultMap = new Map<
               string,
               { name: string; url: string }[]
            >();

            for (const result of results) {
               if (!resultMap.get(result.category)) {
                  resultMap.set(result.category, []);
               }

               resultMap.get(result.category)?.push({
                  name: result.name,
                  url: result.url,
               });
            }

            const showResults: string[] = [];
            resultMap.forEach((value, key) => {
               return showResults.push(
                  `\n**${capitalizeFirstLetter(key)}:**${value.map(
                     (v) => `\n[${v.name}](${v.url})`,
                  )}`,
               );
            });

            const embed = new MessageEmbed()
               .setTitle('Suchergebnisse')
               .setDescription(
                  `Es wurden **${results.length}** Ergebnisse gefunden.
                  ${showResults.join('\n')}`,
               )
               .setColor(bot.colors.light_blue);
            return interaction.reply({
               embeds: [embed],
            });
         }
      } else {
         const jsonDocs = docs.find((doc) => doc.name === documentationGroup);
         if (!jsonDocs) {
            return interaction.reply(
               `Die Dokumentation für ${documentationGroup} existiert nicht.`,
            );
         }

         const doc = jsonDocs.options.find(
            (option) => option.name === documentation,
         );

         if (!doc) {
            return interaction.reply(
               `Die Dokumentation für ${documentation} existiert nicht.`,
            );
         }

         const embed = new MessageEmbed()
            .setTitle(
               `${capitalizeFirstLetter(
                  jsonDocs.name,
               )} - ${capitalizeFirstLetter(doc.name)}`,
            )
            .setDescription(
               `
               Hier ist die Dokumentation für ${capitalizeFirstLetter(
                  doc.name,
               )}:
               ${doc.url}
         `,
            )
            .setColor(bot.colors.light_blue);

         return interaction.reply({
            embeds: [embed],
         });
      }
   },
});
