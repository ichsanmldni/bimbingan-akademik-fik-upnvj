/*
  Warnings:

  - You are about to drop the column `dosen_id` on the `dosenpa` table. All the data in the column will be lost.
  - You are about to drop the column `dosen_id` on the `kaprodi` table. All the data in the column will be lost.
  - You are about to drop the `dosen` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `dosenpa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nip]` on the table `dosenpa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `kaprodi` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nip]` on the table `kaprodi` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `dosenpa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hp` to the `dosenpa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `dosenpa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nip` to the `dosenpa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `dosenpa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `kaprodi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hp` to the `kaprodi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `kaprodi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nip` to the `kaprodi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `kaprodi` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `dosenpa` DROP FOREIGN KEY `DosenPA_dosen_id_fkey`;

-- DropForeignKey
ALTER TABLE `kaprodi` DROP FOREIGN KEY `Kaprodi_dosen_id_fkey`;

-- DropIndex
DROP INDEX `MasterPeminatan_jurusan_id_fkey` ON `masterpeminatan`;

-- AlterTable
ALTER TABLE `dosenpa` DROP COLUMN `dosen_id`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `hp` VARCHAR(191) NOT NULL,
    ADD COLUMN `nama` VARCHAR(191) NOT NULL,
    ADD COLUMN `nip` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `profile_image` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `kaprodi` DROP COLUMN `dosen_id`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `hp` VARCHAR(191) NOT NULL,
    ADD COLUMN `nama` VARCHAR(191) NOT NULL,
    ADD COLUMN `nip` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `profile_image` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `dosen`;

-- CreateIndex
CREATE UNIQUE INDEX `Dosen_email_key` ON `dosenpa`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Dosen_nip_key` ON `dosenpa`(`nip`);

-- CreateIndex
CREATE UNIQUE INDEX `Dosen_email_key` ON `kaprodi`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Dosen_nip_key` ON `kaprodi`(`nip`);
