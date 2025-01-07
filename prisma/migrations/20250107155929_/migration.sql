/*
  Warnings:

  - Added the required column `jadwal_bimbingan` to the `laporanbimbingan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `laporanbimbingan` ADD COLUMN `jadwal_bimbingan` VARCHAR(191) NOT NULL;
