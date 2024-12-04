/*
  Warnings:

  - You are about to drop the column `jenis_bimbingan` on the `laporanbimbingan` table. All the data in the column will be lost.
  - You are about to drop the column `sistem_bimbingan` on the `laporanbimbingan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `laporanbimbingan` DROP COLUMN `jenis_bimbingan`,
    DROP COLUMN `sistem_bimbingan`,
    ADD COLUMN `jenis_bimbingan_id` INTEGER NULL,
    ADD COLUMN `sistem_bimbingan_id` INTEGER NULL,
    MODIFY `feedback_kaprodi` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `LaporanBimbingan` ADD CONSTRAINT `LaporanBimbingan_jenis_bimbingan_id_fkey` FOREIGN KEY (`jenis_bimbingan_id`) REFERENCES `MasterJenisBimbingan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaporanBimbingan` ADD CONSTRAINT `LaporanBimbingan_sistem_bimbingan_id_fkey` FOREIGN KEY (`sistem_bimbingan_id`) REFERENCES `MasterSistemBimbingan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
