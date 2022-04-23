import { ExtentedClient } from './Structures/Client';
import 'dotenv/config';
import {
   GuildSlashCommand,
   SlashcommandOption,
} from '@mxgnus/slashcommands.js';

export const bot = new ExtentedClient({
   intents: 32767,
   token: process.env.TOKEN,
   prefix: process.env.PREFIX,
   footer: {
      text: '',
      iconURL: '',
   },
   partials: ['MESSAGE', 'REACTION', 'CHANNEL', 'USER'],
});

bot.start();
