CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`github_id` integer NOT NULL,
	`username` text NOT NULL,
	`avatar` text NOT NULL,
	`created_at` integer NOT NULL
);
