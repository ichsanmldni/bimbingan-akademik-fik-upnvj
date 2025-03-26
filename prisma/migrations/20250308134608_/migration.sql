/*
  Warnings:

  - You are about to drop the column `nidn` on the `dosenpa` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nip]` on the table `dosenpa` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Dosen_nidn_key` ON `dosenpa`;

-- AlterTable
ALTER TABLE `dosenpa` DROP COLUMN `nidn`,
    ADD COLUMN `nip` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Dosen_nip_key` ON `dosenpa`(`nip`);
