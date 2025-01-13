-- CreateTable
CREATE TABLE `statuspembacaanpesansiaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pesan_siaran_id` INTEGER NOT NULL,
    `mahasiswa_id` INTEGER NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `statuspembacaanpesansiaran` ADD CONSTRAINT `statuspembacaanpesansiaran_pesan_siaran_id_fkey` FOREIGN KEY (`pesan_siaran_id`) REFERENCES `pesansiaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `statuspembacaanpesansiaran` ADD CONSTRAINT `statuspembacaanpesansiaran_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
