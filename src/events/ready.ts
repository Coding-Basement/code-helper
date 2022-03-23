import { Slash } from '@mxgnus/slashcommands.js';
import { bot } from '..';
import { initPrisma } from '../prisma/client';
import { Event } from '../Structures/Event';
import ConsoleLogger from '../utils/consolelogger';
new Slash(bot, {
   guildId: process.env.GUILD_ID,
});

export default new Event('ready', async () => {
   new ConsoleLogger('Logged in as ' + bot.user?.tag).info();
   initPrisma();
});
