-- DropForeignKey
ALTER TABLE `laporanbimbingan` DROP FOREIGN KEY `LaporanBimbingan_kaprodi_id_fkey`;

-- AlterTable
ALTER TABLE `laporanbimbingan` MODIFY `kaprodi_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `laporanbimbingan` ADD CONSTRAINT `LaporanBimbingan_kaprodi_id_fkey` FOREIGN KEY (`kaprodi_id`) REFERENCES `kaprodi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
