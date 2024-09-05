-- CreateTable
CREATE TABLE `notification_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `service` VARCHAR(100) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `notifiable_type` VARCHAR(255) NOT NULL,
    `notifiable_id` VARCHAR(255) NOT NULL,
    `data` JSON NOT NULL,
    `sent_at` DATETIME(3) NULL,
    `read_at` DATETIME(3) NULL,
    `created_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,

    INDEX `notifications_notifiable_id_notifiable_type_idx`(`notifiable_id`, `notifiable_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `codes` (
    `code` VARCHAR(20) NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,
    `deleted_at` TIMESTAMP(6) NULL,

    UNIQUE INDEX `codes_code_key`(`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stg_directories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parent_id` INTEGER NULL,
    `name` VARCHAR(100) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `total_files` INTEGER NOT NULL DEFAULT 0,
    `total_size` DECIMAL(20, 2) NOT NULL DEFAULT 0,
    `starred` BOOLEAN NOT NULL DEFAULT false,
    `editable` BOOLEAN NOT NULL DEFAULT true,
    `removable` BOOLEAN NOT NULL DEFAULT true,
    `description` VARCHAR(191) NULL,
    `created_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,
    `deleted_at` TIMESTAMP(6) NULL,

    UNIQUE INDEX `stg_directories_path_key`(`path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stg_files` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `file_type` VARCHAR(20) NOT NULL,
    `original_name` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    `ext` VARCHAR(20) NOT NULL,
    `size` INTEGER NOT NULL,
    `attributes` JSON NULL,
    `uploaded_at` TIMESTAMP(6) NULL,
    `created_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,
    `deleted_at` TIMESTAMP(6) NULL,

    UNIQUE INDEX `stg_files_path_key`(`path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stg_file_on_directories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `directory_id` INTEGER NOT NULL,
    `file_id` INTEGER NOT NULL,
    `dir_name` VARCHAR(100) NOT NULL,
    `dir_path` VARCHAR(191) NOT NULL,
    `file_original_name` VARCHAR(255) NOT NULL,
    `file_name` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `ext` VARCHAR(20) NOT NULL,
    `size` INTEGER NOT NULL,
    `attributes` JSON NULL,
    `starred` BOOLEAN NOT NULL DEFAULT false,
    `editable` BOOLEAN NOT NULL DEFAULT true,
    `removable` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,
    `deleted_at` TIMESTAMP(6) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `slug` VARCHAR(50) NOT NULL,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,
    `deleted_at` TIMESTAMP(6) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `module` VARCHAR(50) NOT NULL,
    `action` VARCHAR(50) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,
    `deleted_at` TIMESTAMP(6) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions_on_roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_id` INTEGER NOT NULL,
    `permission_id` INTEGER NOT NULL,
    `assigned_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions_on_identities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identity_id` VARCHAR(191) NOT NULL,
    `permission_id` INTEGER NOT NULL,
    `assigned_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `identities` (
    `id` VARCHAR(191) NOT NULL,
    `role_id` INTEGER NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `created_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `disabled_at` TIMESTAMP(6) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `picture_id` INTEGER NULL,
    `created_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,
    `deleted_at` TIMESTAMP(6) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notification_tokens` ADD CONSTRAINT `notification_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stg_directories` ADD CONSTRAINT `stg_directories_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `stg_directories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stg_file_on_directories` ADD CONSTRAINT `stg_file_on_directories_directory_id_fkey` FOREIGN KEY (`directory_id`) REFERENCES `stg_directories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stg_file_on_directories` ADD CONSTRAINT `stg_file_on_directories_file_id_fkey` FOREIGN KEY (`file_id`) REFERENCES `stg_files`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permissions_on_roles` ADD CONSTRAINT `permissions_on_roles_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permissions_on_roles` ADD CONSTRAINT `permissions_on_roles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permissions_on_identities` ADD CONSTRAINT `permissions_on_identities_identity_id_fkey` FOREIGN KEY (`identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permissions_on_identities` ADD CONSTRAINT `permissions_on_identities_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `identities` ADD CONSTRAINT `identities_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `identities` ADD CONSTRAINT `identities_id_fkey` FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `identities` ADD CONSTRAINT `identities_status_fkey` FOREIGN KEY (`status`) REFERENCES `codes`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_type_fkey` FOREIGN KEY (`type`) REFERENCES `codes`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_picture_id_fkey` FOREIGN KEY (`picture_id`) REFERENCES `stg_file_on_directories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
