import {
   ApplicationCommandDataResolvable,
   BaseGuildTextChannel,
   Client,
   ClientEvents,
   Collection,
   PartialTypes,
} from 'discord.js';
import { ClientOptions, RegisterSlashCommandOptions } from '../types/Client';
import { MessageCommandType } from '../types/MessageCommand';
import { readdirSync, existsSync } from 'fs';
import path from 'path';
import { Event } from '../Structures/Event';
import { FunctionType } from '../types/Function';
import colors from '../colors.json';
import ConsoleLogger from '../utils/consolelogger';
import { SlashCommandType } from '../types/SlashCommand';

export class ExtentedClient extends Client {
   public commands: Collection<string, MessageCommandType> = new Collection();
   public slashCommands: Collection<string, SlashCommandType> =
      new Collection();
   public readonly token: string;
   public prefix: string;
   public colors: typeof colors = colors;
   public footer: {
      text: string;
      iconURL: string;
   };
   public partials: PartialTypes[] | undefined = undefined;

   constructor({ intents, token, prefix, footer, partials }: ClientOptions) {
      super({
         intents,
         partials,
      });

      this.token = token;
      this.prefix = prefix;
      this.footer = footer;
      this.partials = partials;
   }

   public async start() {
      this.login(this.token);
      await this.registerSlashCommands();
      await this.registerMessageCommands();
      await this.registerEvents();
   }

   public async importFile(filePath: string) {
      return (await import(filePath))?.default;
   }

   async registerDiscordSlashCommands({
      commands,
      guildID,
   }: RegisterSlashCommandOptions) {
      if (guildID) {
         this.guilds.cache.get(guildID)?.commands.set(commands);
         new ConsoleLogger(`Registering commands to ${guildID}`).info();
      } else {
         this.application?.commands.set(commands);
         new ConsoleLogger('Registering global commands').info();
      }
   }

   public async registerMessageCommands() {
      const commandsPath = path.resolve('dist', 'commands');
      if (!existsSync(commandsPath)) return;
      const commandDirectorys = readdirSync(commandsPath, {
         withFileTypes: true,
      }).filter((dirent) => dirent.isDirectory());
      for (const directory of commandDirectorys) {
         const commandFiles = readdirSync(
            path.resolve(commandsPath, directory.name),
         ).filter((file) => file.endsWith('.js'));
         for (const file of commandFiles) {
            const command: MessageCommandType = await this.importFile(
               path.resolve(commandsPath, directory.name, file),
            );
            this.commands.set(command.name, command);
         }
      }
   }

   public async registerSlashCommands() {
      const slashCommands: ApplicationCommandDataResolvable[] = [];
      const slashCommandsPath = path.resolve('dist', 'slashcommands');
      if (!existsSync(slashCommandsPath)) return;
      const slashCommandDirectorys = readdirSync(slashCommandsPath, {
         withFileTypes: true,
      }).filter((dirent) => dirent.isDirectory());
      for (const directory of slashCommandDirectorys) {
         const slashCommandFiles = readdirSync(
            path.resolve(slashCommandsPath, directory.name),
         ).filter((file) => file.endsWith('.js'));
         for (const file of slashCommandFiles) {
            const slashCommand: SlashCommandType = await this.importFile(
               path.resolve(slashCommandsPath, directory.name, file),
            );
            if (!slashCommand.name) continue;
            this.slashCommands.set(slashCommand.name, slashCommand);
            slashCommands.push(slashCommand);
         }
      }

      this.on('ready', () => {
         this.registerDiscordSlashCommands({
            commands: slashCommands,
            guildID: process.env.GUILD_ID,
         });
      });
   }

   public async registerEvents() {
      const eventsPath = path.resolve('dist', 'events');
      const eventFiles = readdirSync(eventsPath, {
         withFileTypes: true,
      }).filter((dirent) => dirent.isFile());
      for (const file of eventFiles) {
         const event: Event<keyof ClientEvents> = await this.importFile(
            path.resolve(eventsPath, file.name),
         );
         this.on(event.event, event.execute);
      }
   }

   public async getGuild() {
      return (
         this.guilds.cache.get(process.env.GUILD_ID) ||
         (await this.guilds.fetch(process.env.GUILD_ID).catch((e) => {
            console.error(e);
            return null;
         }))
      );
   }

   public async getMember(userId: string) {
      const guild = await this.getGuild();
      if (!guild) return null;
      return (
         guild.members.cache.get(userId) ||
         (await guild.members.fetch(userId).catch((e) => {
            console.error(e);
            return null;
         }))
      );
   }

   public async getChannel(channelId: string) {
      const guild = await this.getGuild();
      if (!guild) return null;
      return (
         guild.channels.cache.get(channelId) ||
         (await guild.channels.fetch(channelId).catch((e) => {
            console.error(e);
            return null;
         }))
      );
   }

   public async getMessage(messageId: string, channelId: string) {
      const channel = await this.getChannel(channelId);
      if (!channel || !channel.isText()) return null;
      return await channel.messages.fetch(messageId).catch((e) => {
         console.error(e);
         return null;
      });
   }

   public async getRole(roleId: string) {
      const guild = await this.getGuild();
      if (!guild) return null;
      return (
         guild.roles.cache.get(roleId) ||
         (await guild.roles.fetch(roleId).catch((e) => {
            console.error(e);
            return null;
         }))
      );
   }

   public async getMemberRoles(userId: string) {
      const member = await this.getMember(userId);
      if (!member) return null;
      return member.roles.cache;
   }
}
