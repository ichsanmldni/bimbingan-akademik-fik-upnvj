/*
  Warnings:

  - You are about to drop the column `dosen_id` on the `mahasiswa` table. All the data in the column will be lost.
  - You are about to drop the column `nama_dosen_PA` on the `mahasiswa` table. All the data in the column will be lost.
  - Added the required column `dosen_pa_id` to the `Mahasiswa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `mahasiswa` DROP FOREIGN KEY `Mahasiswa_dosen_id_fkey`;

-- AlterTable
ALTER TABLE `mahasiswa` DROP COLUMN `dosen_id`,
    DROP COLUMN `nama_dosen_PA`,
    ADD COLUMN `dosen_pa_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Mahasiswa` ADD CONSTRAINT `Mahasiswa_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `Dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
