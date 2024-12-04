/*
  Warnings:

  - You are about to drop the column `dosen_pa_id` on the `mahasiswa` table. All the data in the column will be lost.
  - Added the required column `nama_dosen_PA` to the `Mahasiswa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `mahasiswa` DROP FOREIGN KEY `Mahasiswa_dosen_pa_id_fkey`;

-- AlterTable
ALTER TABLE `mahasiswa` DROP COLUMN `dosen_pa_id`,
    ADD COLUMN `dosen_id` INTEGER NULL,
    ADD COLUMN `nama_dosen_PA` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Mahasiswa` ADD CONSTRAINT `Mahasiswa_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `Dosen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
