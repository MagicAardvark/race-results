ALTER TABLE "results_events" ADD COLUMN "start_date" date;--> statement-breakpoint
ALTER TABLE "results_events" ADD COLUMN "start_time" time;--> statement-breakpoint
ALTER TABLE "results_events" ADD COLUMN "end_date" date;--> statement-breakpoint
ALTER TABLE "results_events" ADD COLUMN "end_time" time;--> statement-breakpoint
ALTER TABLE "results_events" ADD COLUMN "timezone" text;--> statement-breakpoint

UPDATE "results_events" 
SET 
    "start_date" = start_at::DATE,
    "start_time" = '00:00:00',
    "end_date" = end_at::DATE,
    "end_time" = '23:59:59',
    "timezone" = 'America/New_York'; --> statement-breakpoint

ALTER TABLE "results_events" ALTER COLUMN "start_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "results_events" ALTER COLUMN "start_time" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "results_events" ALTER COLUMN "end_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "results_events" ALTER COLUMN "end_time" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "results_events" ALTER COLUMN "timezone" SET NOT NULL;

ALTER TABLE "results_events" DROP COLUMN "start_at";--> statement-breakpoint
ALTER TABLE "results_events" DROP COLUMN "end_at";

