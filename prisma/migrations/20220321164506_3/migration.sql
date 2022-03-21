/*
  Warnings:

  - A unique constraint covering the columns `[messageid]` on the table `Application` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Application_messageid_key` ON `Application`(`messageid`);
