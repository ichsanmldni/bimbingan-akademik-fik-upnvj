/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `mahasiswa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `mahasiswa` DROP COLUMN `isDeleted`,
    ADD COLUMN `status_lulus` BOOLEAN NOT NULL DEFAULT false;
