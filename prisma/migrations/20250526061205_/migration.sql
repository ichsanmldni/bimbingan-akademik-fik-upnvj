-- AlterTable
ALTER TABLE `mahasiswa` ADD COLUMN `last_token_reset` DATETIME(3) NULL,
    ADD COLUMN `token_limit` INTEGER NULL DEFAULT 200000,
    ADD COLUMN `used_tokens` INTEGER NULL DEFAULT 0;
