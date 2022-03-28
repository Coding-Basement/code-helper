-- CreateTable
CREATE TABLE `HelpThread` (
    `id` VARCHAR(18) NOT NULL,
    `userid` VARCHAR(18) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `problem` TEXT NOT NULL,
    `nodeversion` VARCHAR(191) NOT NULL,
    `additionalinformations` TEXT NULL,
    `createdat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `HelpThread_id_key`(`id`),
    PRIMARY KEY (`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
