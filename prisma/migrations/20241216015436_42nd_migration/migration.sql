/*
  Warnings:

  - Added the required column `jumlah_mahasiswa` to the `laporanbimbingan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `laporanbimbingan` ADD COLUMN `jumlah_mahasiswa` INTEGER NOT NULL;
