-- AlterTable
ALTER TABLE `Application` ADD COLUMN `accepted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `closed` BOOLEAN NOT NULL DEFAULT false;
