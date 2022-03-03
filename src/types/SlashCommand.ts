import {
   ChatInputApplicationCommandData,
   CommandInteraction,
   CommandInteractionOptionResolver,
   GuildMember,
   PermissionString,
} from 'discord.js';

export interface ExtendedInteraction extends CommandInteraction {
   member: GuildMember;
}

interface ExecuteOptions {
   interaction: ExtendedInteraction;
   args: CommandInteractionOptionResolver;
}

type ExecuteFunction = (options: ExecuteOptions) => any;

export type SlashCommandType = {
   permission?: PermissionString;
   execute: ExecuteFunction;
} & ChatInputApplicationCommandData;
