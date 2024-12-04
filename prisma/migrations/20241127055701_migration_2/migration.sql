-- CreateTable
CREATE TABLE `MasterTahunAjaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tahunAjaran` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterJurusan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jurusan` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterPeminatan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `peminatan` VARCHAR(191) NOT NULL,
    `jurusanId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterJenisBimbingan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jenisBimbingan` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MasterPeminatan` ADD CONSTRAINT `MasterPeminatan_jurusanId_fkey` FOREIGN KEY (`jurusanId`) REFERENCES `MasterJurusan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
