/*
  Warnings:

  - You are about to drop the column `tahunAjaran` on the `mastertahunajaran` table. All the data in the column will be lost.
  - Added the required column `tahun_ajaran` to the `MasterTahunAjaran` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mastertahunajaran` DROP COLUMN `tahunAjaran`,
    ADD COLUMN `tahun_ajaran` VARCHAR(191) NOT NULL;
