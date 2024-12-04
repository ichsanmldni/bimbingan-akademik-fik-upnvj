/*
  Warnings:

  - You are about to drop the column `jenisBimbingan` on the `masterjenisbimbingan` table. All the data in the column will be lost.
  - You are about to drop the column `jurusanId` on the `masterpeminatan` table. All the data in the column will be lost.
  - Added the required column `jenis_bimbingan` to the `MasterJenisBimbingan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jurusan_id` to the `MasterPeminatan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `masterpeminatan` DROP FOREIGN KEY `MasterPeminatan_jurusanId_fkey`;

-- AlterTable
ALTER TABLE `masterjenisbimbingan` DROP COLUMN `jenisBimbingan`,
    ADD COLUMN `jenis_bimbingan` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `masterpeminatan` DROP COLUMN `jurusanId`,
    ADD COLUMN `jurusan_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `MasterPeminatan` ADD CONSTRAINT `MasterPeminatan_jurusan_id_fkey` FOREIGN KEY (`jurusan_id`) REFERENCES `MasterJurusan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
