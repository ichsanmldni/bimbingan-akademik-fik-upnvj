/*
  Warnings:

  - You are about to drop the column `tanggal_bimbingan` on the `laporanbimbingan` table. All the data in the column will be lost.
  - Added the required column `jadwal_bimbingan` to the `LaporanBimbingan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `laporanbimbingan` DROP COLUMN `tanggal_bimbingan`,
    ADD COLUMN `jadwal_bimbingan` VARCHAR(191) NOT NULL;
