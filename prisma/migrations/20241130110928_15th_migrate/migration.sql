/*
  Warnings:

  - You are about to alter the column `order` on the `masterjenisbimbingan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `order` on the `masterjurusan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `order` on the `masterpeminatan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `order` on the `mastersistembimbingan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `order` on the `mastertahunajaran` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `masterjenisbimbingan` MODIFY `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `masterjurusan` MODIFY `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `masterpeminatan` MODIFY `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `mastersistembimbingan` MODIFY `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `mastertahunajaran` MODIFY `order` INTEGER NOT NULL;
