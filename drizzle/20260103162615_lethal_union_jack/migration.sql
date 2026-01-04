CREATE TABLE "org_api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"org_id" uuid,
	"api_key" text NOT NULL,
	"api_key_enabled" boolean DEFAULT true NOT NULL,
	"effective_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orgs" ALTER COLUMN "motorsportreg_org_id" DROP NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "org_api_key_idx" ON "org_api_keys" ("org_id","api_key");--> statement-breakpoint
CREATE INDEX "api_key_enabled_idx" ON "org_api_keys" ("api_key_enabled");