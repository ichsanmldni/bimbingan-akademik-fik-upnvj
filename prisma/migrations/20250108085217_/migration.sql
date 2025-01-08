/*
  Warnings:

  - You are about to drop the column `kaprodi_jurusan_id` on the `kaprodi` table. All the data in the column will be lost.
  - You are about to drop the `masterjurusan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `kaprodi` DROP FOREIGN KEY `Kaprodi_kaprodi_jurusan_id_fkey`;

-- DropForeignKey
ALTER TABLE `masterpeminatan` DROP FOREIGN KEY `MasterPeminatan_jurusan_id_fkey`;

-- AlterTable
ALTER TABLE `kaprodi` DROP COLUMN `kaprodi_jurusan_id`;

-- DropTable
DROP TABLE `masterjurusan`;
