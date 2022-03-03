import { Message, PermissionString } from 'discord.js';

interface ExecuteOptions {
   message: Message;
   args: string[];
}

export type ExecuteFunction = (options: ExecuteOptions) => any;

export interface MessageCommandType {
   name: string;
   description: string;
   category: string;
   permission?: PermissionString;
   isDisabled?: boolean;
   aliases?: string[];
   execute: ExecuteFunction;
}
