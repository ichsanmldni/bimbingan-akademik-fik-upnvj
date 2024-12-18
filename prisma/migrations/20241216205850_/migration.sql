/*
  Warnings:

  - You are about to drop the `menuinformasiakademik` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `submenuinformasiakademik` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `submenuinformasiakademik` DROP FOREIGN KEY `SubmenuInformasiAkademik_menu_informasi_akademik_id_fkey`;

-- DropTable
DROP TABLE `menuinformasiakademik`;

-- DropTable
DROP TABLE `submenuinformasiakademik`;

-- CreateTable
CREATE TABLE `masterbabinformasiakademik` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mastersubbabinformasiakademik` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bab_informasi_akademik_id` INTEGER NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `isi` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,

    INDEX `mastersubbabinformasiakademik_bab_informasi_akademik_id_fkey`(`bab_informasi_akademik_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mastersubbabinformasiakademik` ADD CONSTRAINT `mastersubbabinformasiakademik_bab_informasi_akademik_id_fkey` FOREIGN KEY (`bab_informasi_akademik_id`) REFERENCES `masterbabinformasiakademik`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
