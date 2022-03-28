import { Config, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;

export async function initPrisma() {
   const config = await prisma.config.findMany();
   createConfig(config);
}

async function createConfig(config: Config[]) {
   const applyStatusConfig = config.find((c) => c.name === 'applystatus');
   if (!applyStatusConfig) {
      await prisma.config.create({
         data: {
            name: 'applystatus',
            value: 'false',
         },
      });
   }
}

export async function getConfig(name: string) {
   return await prisma.config.findUnique({
      where: {
         name,
      },
   });
}
