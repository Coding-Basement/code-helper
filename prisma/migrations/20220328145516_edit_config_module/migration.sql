/*
  Warnings:

  - You are about to alter the column `value` on the `Config` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Config` MODIFY `value` VARCHAR(191) NOT NULL;
