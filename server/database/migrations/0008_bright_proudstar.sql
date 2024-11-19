CREATE TABLE `tps_vote_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tps_vote_id` integer NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`tps_vote_id`) REFERENCES `tps_votes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_locations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`province_id` integer,
	`regency_id` integer,
	`district_id` integer,
	`village_id` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`province_id`) REFERENCES `provinces`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`regency_id`) REFERENCES `regencies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`village_id`) REFERENCES `villages`(`id`) ON UPDATE no action ON DELETE no action
);
