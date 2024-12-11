/*
  Warnings:

  - You are about to drop the column `nama_lengkap` on the `laporanbimbingan` table. All the data in the column will be lost.
  - Added the required column `nama_mahasiswa` to the `LaporanBimbingan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `laporanbimbingan` DROP COLUMN `nama_lengkap`,
    ADD COLUMN `nama_mahasiswa` VARCHAR(191) NOT NULL;
