/*
  Warnings:

  - Made the column `nip` on table `dosenpa` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `dosenpa` MODIFY `nip` VARCHAR(191) NOT NULL;
