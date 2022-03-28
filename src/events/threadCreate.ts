import { updateThreadNotifyMessage } from '../modules/codingtreads';
import { Event } from '../Structures/Event';

export default new Event('threadCreate', async (thread) => {
   setTimeout(() => {
      updateThreadNotifyMessage();
   }, 1000);
});
