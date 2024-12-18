/*
  Warnings:

  - Added the required column `order` to the `menuinformasiakademik` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `submenuinformasiakademik` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `menuinformasiakademik` ADD COLUMN `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `submenuinformasiakademik` ADD COLUMN `order` INTEGER NOT NULL;
