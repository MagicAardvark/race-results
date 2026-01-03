CREATE TABLE "feature_flags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"org_id" uuid NOT NULL,
	"feature_key" text NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "orgs" ALTER COLUMN "motorsportreg_org_id" DROP NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "org_feature_key_idx" ON "feature_flags" ("org_id","feature_key");--> statement-breakpoint
CREATE INDEX "org_id_idx" ON "feature_flags" ("org_id");--> statement-breakpoint
CREATE INDEX "feature_key_idx" ON "feature_flags" ("feature_key");--> statement-breakpoint
ALTER TABLE "feature_flags" ADD CONSTRAINT "feature_flags_org_id_orgs_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE;