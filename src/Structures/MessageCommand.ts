import { MessageCommandType } from '../types/MessageCommand';

export class MessageCommand {
   constructor(commandOptions: MessageCommandType) {
      Object.assign(this, commandOptions);
   }
}
