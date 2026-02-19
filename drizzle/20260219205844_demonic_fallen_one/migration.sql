CREATE TABLE "msr_event_venues" (
	"id" text PRIMARY KEY,
	"city" text,
	"region" text,
	"country" text,
	"postal_code" text,
	"lat" numeric(10,7),
	"lng" numeric(10,7)
);
--> statement-breakpoint
CREATE TABLE "msr_events" (
	"id" text PRIMARY KEY,
	"org_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image" text,
	"type" text NOT NULL,
	"start" date NOT NULL,
	"end" date NOT NULL,
	"registration_start" date,
	"registration_start_time" time,
	"registration_end" date,
	"registration_end_time" time,
	"detail_uri" text NOT NULL,
	"venue_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "msr_events" ADD CONSTRAINT "msr_events_org_id_orgs_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "msr_events" ADD CONSTRAINT "msr_events_venue_id_msr_event_venues_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "msr_event_venues"("id") ON DELETE CASCADE;