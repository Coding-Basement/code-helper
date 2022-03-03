import { SlashCommandType } from '../types/SlashCommand';

export class SlashCommand {
   constructor(commandOptions: SlashCommandType) {
      Object.assign(this, commandOptions);
   }
}
