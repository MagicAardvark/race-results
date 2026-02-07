CREATE TABLE "results_event_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"event_id" uuid NOT NULL,
	"class_id" uuid NOT NULL,
	"class_group_id" uuid,
	"number" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"car_year" integer NOT NULL,
	"car_make" text NOT NULL,
	"car_model" text NOT NULL,
	"sponsor" text NOT NULL,
	"external_account_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "results_event_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"entry_id" uuid NOT NULL,
	"segment_id" uuid NOT NULL,
	"run_number" integer NOT NULL,
	"status" text NOT NULL,
	"time_ms" integer,
	"penalty_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "results_event_segments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"event_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "results_event_entries" ADD CONSTRAINT "results_event_entries_event_id_results_events_id_fkey" FOREIGN KEY ("event_id") REFERENCES "results_events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "results_event_entries" ADD CONSTRAINT "results_event_entries_class_id_classes_base_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes_base"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "results_event_entries" ADD CONSTRAINT "results_event_entries_class_group_id_classes_groups_id_fkey" FOREIGN KEY ("class_group_id") REFERENCES "classes_groups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "results_event_runs" ADD CONSTRAINT "results_event_runs_entry_id_results_event_entries_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "results_event_entries"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "results_event_runs" ADD CONSTRAINT "results_event_runs_segment_id_results_event_segments_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "results_event_segments"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "results_event_segments" ADD CONSTRAINT "results_event_segments_event_id_results_events_id_fkey" FOREIGN KEY ("event_id") REFERENCES "results_events"("id") ON DELETE CASCADE;