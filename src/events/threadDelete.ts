import { updateThreadNotifyMessage } from '../modules/codingtreads';
import prisma from '../prisma/client';
import { Event } from '../Structures/Event';

export default new Event('threadDelete', async (thread) => {
   await prisma.helpThread.update({
      where: {
         id: thread.id,
      },
      data: {
         closed: true,
      },
   });

   await updateThreadNotifyMessage();
});
