-- CreateTable
CREATE TABLE `pushsubscription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mahasiswa_id` INTEGER NULL,
    `dosen_pa_id` INTEGER NULL,
    `kaprodi_id` INTEGER NULL,
    `endpoint` VARCHAR(500) NOT NULL,
    `keys` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `pushsubscription_endpoint_key`(`endpoint`),
    INDEX `pushsubscription_mahasiswa_id_idx`(`mahasiswa_id`),
    INDEX `pushsubscription_dosen_pa_id_idx`(`dosen_pa_id`),
    INDEX `pushsubscription_kaprodi_id_idx`(`kaprodi_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pushsubscription` ADD CONSTRAINT `pushsubscription_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pushsubscription` ADD CONSTRAINT `pushsubscription_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `dosenpa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pushsubscription` ADD CONSTRAINT `pushsubscription_kaprodi_id_fkey` FOREIGN KEY (`kaprodi_id`) REFERENCES `kaprodi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
