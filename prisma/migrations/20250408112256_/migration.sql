/*
  Warnings:

  - You are about to drop the column `nip` on the `dosenpa` table. All the data in the column will be lost.
  - You are about to drop the column `nip` on the `kaprodi` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Dosen_nip_key` ON `dosenpa`;

-- DropIndex
DROP INDEX `Dosen_nip_key` ON `kaprodi`;

-- AlterTable
ALTER TABLE `dosenpa` DROP COLUMN `nip`;

-- AlterTable
ALTER TABLE `kaprodi` DROP COLUMN `nip`;
