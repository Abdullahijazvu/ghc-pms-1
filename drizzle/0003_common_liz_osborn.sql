CREATE TABLE `body_point_config` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`business_id` int NOT NULL,
	`points` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `body_point_config_id` PRIMARY KEY(`id`),
	CONSTRAINT `body_point_config_business_id_unique` UNIQUE(`business_id`)
);
