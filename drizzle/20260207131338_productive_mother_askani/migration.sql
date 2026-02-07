ALTER TABLE "results_event_entries" RENAME COLUMN "number" TO "car_number";--> statement-breakpoint
ALTER TABLE "results_event_entries" RENAME COLUMN "name" TO "driver_name";--> statement-breakpoint
ALTER TABLE "results_event_entries" DROP COLUMN "car_year";--> statement-breakpoint
ALTER TABLE "results_event_entries" DROP COLUMN "car_make";--> statement-breakpoint
ALTER TABLE "results_event_entries" ALTER COLUMN "external_account_id" DROP NOT NULL;