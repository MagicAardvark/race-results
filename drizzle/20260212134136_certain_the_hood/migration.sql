ALTER TABLE "results_seasons" RENAME COLUMN "start_at" TO "start_date";--> statement-breakpoint
ALTER TABLE "results_seasons" RENAME COLUMN "end_at" TO "end_date";--> statement-breakpoint
ALTER TABLE "results_seasons" ALTER COLUMN "start_date" SET DATA TYPE date USING "start_date"::date;--> statement-breakpoint
ALTER TABLE "results_seasons" ALTER COLUMN "end_date" SET DATA TYPE date USING "end_date"::date;