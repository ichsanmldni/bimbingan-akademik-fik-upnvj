-- CreateTable
CREATE TABLE `mastertopikbimbinganpribadi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `topik_bimbingan` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
