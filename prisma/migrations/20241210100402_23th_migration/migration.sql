/*
  Warnings:

  - You are about to drop the column `jadwal_bimbingan` on the `laporanbimbingan` table. All the data in the column will be lost.
  - You are about to drop the column `jumlah_mahasiswa` on the `laporanbimbingan` table. All the data in the column will be lost.
  - Added the required column `waktu_bimbingan` to the `LaporanBimbingan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `laporanbimbingan` DROP COLUMN `jadwal_bimbingan`,
    DROP COLUMN `jumlah_mahasiswa`,
    ADD COLUMN `waktu_bimbingan` VARCHAR(191) NOT NULL;
