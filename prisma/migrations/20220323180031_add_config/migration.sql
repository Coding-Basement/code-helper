-- CreateTable
CREATE TABLE `Config` (
    `name` VARCHAR(191) NOT NULL,
    `value` BOOLEAN NOT NULL,

    UNIQUE INDEX `Config_name_key`(`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
