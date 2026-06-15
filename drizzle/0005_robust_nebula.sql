ALTER TABLE `body_point_config` ADD CONSTRAINT `body_point_config_image_key_unique` UNIQUE(`image_key`);--> statement-breakpoint
ALTER TABLE `body_point_config` ADD `image_key` varchar(50) NOT NULL;