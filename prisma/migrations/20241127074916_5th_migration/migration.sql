/*
  Warnings:

  - You are about to drop the column `dosen_id` on the `mahasiswa` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `mahasiswa` DROP FOREIGN KEY `Mahasiswa_dosen_id_fkey`;

-- AlterTable
ALTER TABLE `mahasiswa` DROP COLUMN `dosen_id`,
    ADD COLUMN `dosen_pa_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Mahasiswa` ADD CONSTRAINT `Mahasiswa_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `Dosen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
