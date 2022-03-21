/*
  Warnings:

  - Added the required column `messageid` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Application` ADD COLUMN `createdat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `messageid` VARCHAR(18) NOT NULL,
    ADD COLUMN `updatedat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
