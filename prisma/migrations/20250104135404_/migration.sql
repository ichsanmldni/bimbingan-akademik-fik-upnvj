/*
  Warnings:

  - Added the required column `jurusan` to the `pengajuanbimbingan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pengajuanbimbingan` ADD COLUMN `jurusan` VARCHAR(191) NOT NULL;
