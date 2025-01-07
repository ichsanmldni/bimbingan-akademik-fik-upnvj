-- DropForeignKey
ALTER TABLE `laporanbimbingan` DROP FOREIGN KEY `LaporanBimbingan_dosen_pa_id_fkey`;

-- AlterTable
ALTER TABLE `laporanbimbingan` MODIFY `dosen_pa_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `laporanbimbingan` ADD CONSTRAINT `LaporanBimbingan_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `dosenpa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
