/*
  Warnings:

  - You are about to drop the column `status_bimbingan` on the `bimbingan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `bimbingan` DROP COLUMN `status_bimbingan`,
    ADD COLUMN `status_pengesahan_kehadiran` VARCHAR(191) NULL;
