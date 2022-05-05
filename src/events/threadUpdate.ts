import { updateThreadNotifyMessage } from '../modules/codingtreads';
import prisma from '../prisma/client';
import { Event } from '../Structures/Event';

export default new Event('threadUpdate', async (thread) => {
   if (thread.archived) {
      await prisma.helpThread.update({
         where: {
            id: thread.id,
         },
         data: {
            closed: true,
         },
      });

      await updateThreadNotifyMessage();
   }
});
