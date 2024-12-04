/*
  Warnings:

  - Added the required column `order` to the `MasterJenisBimbingan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `MasterJurusan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `MasterPeminatan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `MasterSistemBimbingan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `MasterTahunAjaran` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `masterjenisbimbingan` ADD COLUMN `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `masterjurusan` ADD COLUMN `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `masterpeminatan` ADD COLUMN `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `mastersistembimbingan` ADD COLUMN `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `mastertahunajaran` ADD COLUMN `order` INTEGER NOT NULL;
