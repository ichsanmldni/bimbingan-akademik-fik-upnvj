/*
  Warnings:

  - Added the required column `nama_lengkap` to the `LaporanBimbingan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `laporanbimbingan` ADD COLUMN `nama_lengkap` VARCHAR(191) NOT NULL;
