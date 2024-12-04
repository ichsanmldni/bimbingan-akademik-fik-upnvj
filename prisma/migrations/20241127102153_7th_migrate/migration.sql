/*
  Warnings:

  - You are about to drop the column `email` on the `kaprodi` table. All the data in the column will be lost.
  - You are about to drop the column `nama_dosen_PA` on the `kaprodi` table. All the data in the column will be lost.
  - You are about to drop the column `nama_lengkap` on the `kaprodi` table. All the data in the column will be lost.
  - You are about to drop the column `nim` on the `kaprodi` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `kaprodi` table. All the data in the column will be lost.
  - Added the required column `kaprodi_jurusan_id` to the `Kaprodi` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Kaprodi_email_key` ON `kaprodi`;

-- AlterTable
ALTER TABLE `kaprodi` DROP COLUMN `email`,
    DROP COLUMN `nama_dosen_PA`,
    DROP COLUMN `nama_lengkap`,
    DROP COLUMN `nim`,
    DROP COLUMN `password`,
    ADD COLUMN `dosen_id` INTEGER NULL,
    ADD COLUMN `kaprodi_jurusan_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Kaprodi` ADD CONSTRAINT `Kaprodi_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `Dosen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kaprodi` ADD CONSTRAINT `Kaprodi_kaprodi_jurusan_id_fkey` FOREIGN KEY (`kaprodi_jurusan_id`) REFERENCES `MasterJurusan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
