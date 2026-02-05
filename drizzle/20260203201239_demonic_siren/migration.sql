CREATE TABLE "results_seasons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"org_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "org_events" RENAME TO "results_events";--> statement-breakpoint
ALTER INDEX "org_events_org_id_idx" RENAME TO "results_events_org_id_idx";--> statement-breakpoint
ALTER TABLE "results_events" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "results_seasons" ADD CONSTRAINT "results_seasons_org_id_orgs_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE;