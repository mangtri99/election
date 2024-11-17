PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tps_votes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`province_id` integer,
	`regency_id` integer,
	`district_id` integer,
	`village_id` integer,
	`tps_id` integer,
	`tps_number` text,
	`total_valid_vote` integer DEFAULT 0 NOT NULL,
	`total_invalid_vote` integer DEFAULT 0 NOT NULL,
	`total_dpt_active` integer DEFAULT 0 NOT NULL,
	`total_dpt_passive` integer DEFAULT 0 NOT NULL,
	`total_other_dpt` integer DEFAULT 0 NOT NULL,
	`total_dpt` integer DEFAULT 0 NOT NULL,
	`user_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`province_id`) REFERENCES `provinces`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`regency_id`) REFERENCES `regencies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`village_id`) REFERENCES `villages`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tps_id`) REFERENCES `tps`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_tps_votes`("id", "province_id", "regency_id", "district_id", "village_id", "tps_id", "tps_number", "total_valid_vote", "total_invalid_vote", "total_dpt_active", "total_dpt_passive", "total_other_dpt", "total_dpt", "user_id", "created_at", "updated_at") SELECT "id", "province_id", "regency_id", "district_id", "village_id", "tps_id", "tps_number", "total_valid_vote", "total_invalid_vote", "total_dpt_active", "total_dpt_passive", "total_other_dpt", "total_dpt", "user_id", "created_at", "updated_at" FROM `tps_votes`;--> statement-breakpoint
DROP TABLE `tps_votes`;--> statement-breakpoint
ALTER TABLE `__new_tps_votes` RENAME TO `tps_votes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `candidate_votes` ADD `created_at` integer NOT NULL;