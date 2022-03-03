import colors from 'colors';
import moment from 'moment';

export default class ConsoleLogger {
   private message: string;

   constructor(message: string) {
      this.message = message;
   }

   public info(): void {
      console.log(
         colors.grey(
            colors.green('Info | ') +
               colors.italic(
                  moment.utc(new Date()).format('DD.MM.YYYY - HH:mm:ss'),
               ) +
               ' | ',
         ) + colors.cyan(this.message),
      );
      return;
   }
   public error(): void {
      console.log(
         colors.grey(
            colors.red('Error | ') +
               colors.italic(
                  moment.utc(new Date()).format('DD.MM.YYYY - HH:mm:ss'),
               ) +
               ' | ',
         ) + colors.cyan(this.message),
      );
      return;
   }
}
