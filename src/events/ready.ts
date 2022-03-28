import { Slash } from '@mxgnus/slashcommands.js';
import { bot } from '..';
import { setupThreadManager } from '../modules/codingtreads';
import { listen } from '../modules/webserver';
import { setupYoutubeNotifier } from '../modules/ytnotify';
import { initPrisma } from '../prisma/client';
import { Event } from '../Structures/Event';
import ConsoleLogger from '../utils/consolelogger';
new Slash(bot, {
   guildId: process.env.GUILD_ID,
});

export default new Event('ready', async () => {
   new ConsoleLogger('Logged in as ' + bot.user?.tag).info();
   initPrisma();
   setupYoutubeNotifier().then(async () => {
      listen();
      await setupThreadManager();
   });
});
