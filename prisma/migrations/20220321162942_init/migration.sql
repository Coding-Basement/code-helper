-- CreateTable
CREATE TABLE `Application` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(18) NOT NULL,
    `nameandage` TEXT NOT NULL,
    `position` TEXT NOT NULL,
    `mainquestion` TEXT NOT NULL,
    `discordquestion` TEXT NOT NULL,
    `additionalinformations` TEXT NULL,

    UNIQUE INDEX `Application_id_key`(`id`),
    PRIMARY KEY (`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
