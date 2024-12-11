-- CreateTable
CREATE TABLE `Bimbingan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pengajuan_bimbingan_id` INTEGER NOT NULL,
    `laporan_bimbingan_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bimbingan` ADD CONSTRAINT `Bimbingan_pengajuan_bimbingan_id_fkey` FOREIGN KEY (`pengajuan_bimbingan_id`) REFERENCES `PengajuanBimbingan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bimbingan` ADD CONSTRAINT `Bimbingan_laporan_bimbingan_id_fkey` FOREIGN KEY (`laporan_bimbingan_id`) REFERENCES `LaporanBimbingan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
