import { bot } from '..';
import { Event } from '../Structures/Event';
import ConsoleLogger from '../utils/consolelogger';

export default new Event('ready', () => {
   new ConsoleLogger('Logged in as ' + bot.user?.tag).info();
});
