-- AlterTable
ALTER TABLE `dosenpa` ADD COLUMN `reset_token` VARCHAR(191) NULL,
    ADD COLUMN `reset_token_expires` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `kaprodi` ADD COLUMN `reset_token` VARCHAR(191) NULL,
    ADD COLUMN `reset_token_expires` VARCHAR(191) NULL;
