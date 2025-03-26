/*
  Warnings:

  - You are about to drop the column `nip` on the `dosenpa` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nidn]` on the table `dosenpa` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Dosen_nip_key` ON `dosenpa`;

-- AlterTable
ALTER TABLE `dosenpa` DROP COLUMN `nip`,
    ADD COLUMN `nidn` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Dosen_nidn_key` ON `dosenpa`(`nidn`);
