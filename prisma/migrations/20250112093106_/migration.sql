-- AlterTable
ALTER TABLE `chatpribadi` MODIFY `pesan_terakhir` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `pesansiaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dosen_pa_id` INTEGER NOT NULL,
    `pesan_terakhir` TEXT NOT NULL,
    `waktu_pesan_terakhir` DATETIME(3) NOT NULL,

    INDEX `Dosen_dosen_pa_id_fkey`(`dosen_pa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pesanchatsiaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pesan_siaran_id` INTEGER NOT NULL,
    `pesan` TEXT NOT NULL,
    `waktu_kirim` DATETIME(3) NOT NULL,

    INDEX `PesanChatSiaran_pesan_siaran_id_fkey`(`pesan_siaran_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pesansiaran` ADD CONSTRAINT `PesanSiaran_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `dosenpa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanchatsiaran` ADD CONSTRAINT `PesanChatSiaran_pesan_siaran_id_fkey` FOREIGN KEY (`pesan_siaran_id`) REFERENCES `pesansiaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
