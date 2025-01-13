/*
  Warnings:

  - A unique constraint covering the columns `[mahasiswa_id]` on the table `statuspembacaanpesansiaran` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Mahasiswa_id_key` ON `statuspembacaanpesansiaran`(`mahasiswa_id`);
