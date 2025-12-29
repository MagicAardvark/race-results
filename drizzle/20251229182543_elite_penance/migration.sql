CREATE TABLE "orgs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL UNIQUE,
	"slug" text NOT NULL UNIQUE,
	"description" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"role_key" text NOT NULL,
	"name" text NOT NULL UNIQUE,
	"effective_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	CONSTRAINT "unique_role" UNIQUE("role_key","effective_at")
);
--> statement-breakpoint
CREATE TABLE "user_global_roles" (
	"user_id" uuid,
	"role_id" uuid,
	"effective_at" timestamp with time zone DEFAULT now(),
	"is_negated" boolean DEFAULT false NOT NULL,
	CONSTRAINT "user_global_roles_pkey" PRIMARY KEY("user_id","role_id","effective_at")
);
--> statement-breakpoint
CREATE TABLE "user_org_roles" (
	"user_id" uuid,
	"role_id" uuid,
	"org_id" uuid,
	"effective_at" timestamp with time zone DEFAULT now(),
	"is_negated" boolean DEFAULT false NOT NULL,
	CONSTRAINT "user_org_roles_pkey" PRIMARY KEY("user_id","role_id","org_id","effective_at")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"auth_provider_id" text NOT NULL UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"display_name" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX "slug_idx" ON "orgs" ("slug");--> statement-breakpoint
CREATE INDEX "slug_with_visibility_idx" ON "orgs" ("slug","is_public");--> statement-breakpoint
CREATE INDEX "user_global_roles_user_idx" ON "user_global_roles" ("user_id");--> statement-breakpoint
CREATE INDEX "user_global_roles_role_idx" ON "user_global_roles" ("role_id");--> statement-breakpoint
CREATE INDEX "user_org_roles_user_idx" ON "user_org_roles" ("user_id");--> statement-breakpoint
CREATE INDEX "user_org_roles_role_idx" ON "user_org_roles" ("role_id");--> statement-breakpoint
CREATE INDEX "user_org_roles_org_idx" ON "user_org_roles" ("org_id");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_provider_idx" ON "users" ("auth_provider_id");--> statement-breakpoint
ALTER TABLE "user_global_roles" ADD CONSTRAINT "user_global_roles_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_org_roles" ADD CONSTRAINT "user_org_roles_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;