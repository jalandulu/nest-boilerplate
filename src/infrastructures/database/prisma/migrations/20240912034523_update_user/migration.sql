-- AlterTable
ALTER TABLE `identities` ADD COLUMN `verified_at` TIMESTAMP(6) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `email_verified_at` TIMESTAMP(6) NULL;
