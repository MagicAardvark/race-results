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
CREATE TABLE "org_api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"org_id" uuid NOT NULL,
	"api_key" text NOT NULL,
	"api_key_enabled" boolean DEFAULT true NOT NULL,
	"effective_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orgs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL UNIQUE,
	"slug" text NOT NULL UNIQUE,
	"motorsportreg_org_id" text UNIQUE,
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
CREATE TABLE "classes_base" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"short_name" text NOT NULL UNIQUE,
	"long_name" text NOT NULL UNIQUE,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"org_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classes_group_classes" (
	"class_group_id" uuid,
	"class_id" uuid,
	CONSTRAINT "classes_group_classes_pkey" PRIMARY KEY("class_group_id","class_id")
);
--> statement-breakpoint
CREATE TABLE "classes_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"short_name" text NOT NULL UNIQUE,
	"long_name" text NOT NULL UNIQUE,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"org_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classes_index_values" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"class_id" uuid NOT NULL,
	"effective_from" timestamp with time zone DEFAULT now() NOT NULL,
	"effective_to" timestamp with time zone DEFAULT now() NOT NULL,
	"index_value" numeric(5,4) NOT NULL,
	"org_id" uuid
);
--> statement-breakpoint
CREATE UNIQUE INDEX "org_feature_key_idx" ON "feature_flags" ("org_id","feature_key");--> statement-breakpoint
CREATE INDEX "org_id_idx" ON "feature_flags" ("org_id");--> statement-breakpoint
CREATE INDEX "feature_key_idx" ON "feature_flags" ("feature_key");--> statement-breakpoint
CREATE UNIQUE INDEX "org_api_key_idx" ON "org_api_keys" ("org_id","api_key");--> statement-breakpoint
CREATE INDEX "api_key_enabled_idx" ON "org_api_keys" ("api_key_enabled");--> statement-breakpoint
CREATE UNIQUE INDEX "slug_idx" ON "orgs" ("slug");--> statement-breakpoint
CREATE INDEX "slug_with_visibility_idx" ON "orgs" ("slug","is_public");--> statement-breakpoint
CREATE INDEX "user_global_roles_user_idx" ON "user_global_roles" ("user_id");--> statement-breakpoint
CREATE INDEX "user_global_roles_role_idx" ON "user_global_roles" ("role_id");--> statement-breakpoint
CREATE INDEX "user_org_roles_user_idx" ON "user_org_roles" ("user_id");--> statement-breakpoint
CREATE INDEX "user_org_roles_role_idx" ON "user_org_roles" ("role_id");--> statement-breakpoint
CREATE INDEX "user_org_roles_org_idx" ON "user_org_roles" ("org_id");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_provider_idx" ON "users" ("auth_provider_id");--> statement-breakpoint
CREATE INDEX "base_class_short_name_idx" ON "classes_base" ("short_name","is_enabled","org_id");--> statement-breakpoint
CREATE INDEX "class_group_class_group_idx" ON "classes_group_classes" ("class_group_id");--> statement-breakpoint
CREATE INDEX "car_class_group_short_name_idx" ON "classes_groups" ("short_name","is_enabled","org_id");--> statement-breakpoint
CREATE INDEX "class_index_value_class_effective_idx" ON "classes_index_values" ("class_id","effective_from","effective_to","org_id");--> statement-breakpoint
ALTER TABLE "feature_flags" ADD CONSTRAINT "feature_flags_org_id_orgs_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "org_api_keys" ADD CONSTRAINT "org_api_keys_org_id_orgs_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_global_roles" ADD CONSTRAINT "user_global_roles_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_org_roles" ADD CONSTRAINT "user_org_roles_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "classes_base" ADD CONSTRAINT "classes_base_org_id_orgs_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "classes_group_classes" ADD CONSTRAINT "classes_group_classes_class_group_id_classes_groups_id_fkey" FOREIGN KEY ("class_group_id") REFERENCES "classes_groups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "classes_group_classes" ADD CONSTRAINT "classes_group_classes_class_id_classes_base_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes_base"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "classes_groups" ADD CONSTRAINT "classes_groups_org_id_orgs_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "classes_index_values" ADD CONSTRAINT "classes_index_values_class_id_classes_base_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes_base"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "classes_index_values" ADD CONSTRAINT "classes_index_values_org_id_orgs_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE;--> statement-breakpoint
CREATE VIEW "classes_flattened_group_classes_vw" AS (
SELECT
    cg.id as class_group_id,
    cgc.class_id,
    cg.org_id,
    cg.short_name as group_short_name,
    cg.long_name as group_long_name
FROM classes_groups cg
INNER JOIN classes_group_classes cgc
    ON cg.id = cgc.class_group_id
);--> statement-breakpoint
CREATE VIEW "classes_effective_index_values_vw" AS (
SELECT
    base.id as class_id,
    base.short_name,
    base.long_name,
    index_values.index_value,
    base.org_id,
    index_values.effective_from,
    index_values.effective_to
FROM classes_base base
INNER JOIN classes_index_values index_values
    ON base.id = index_values.class_id
    AND (
        (base.org_id IS NULL AND index_values.org_id IS NULL)
        OR base.org_id = index_values.org_id
    )
);--> statement-breakpoint
CREATE VIEW "classes_group_effective_index_values_vw" AS (
SELECT
    base.class_id,
    CONCAT(cgc.group_short_name, base.short_name) as short_name,
    CONCAT(cgc.group_long_name, ' ', base.long_name) as long_name,
    base.index_value,
    cgc.org_id,
    base.effective_from,
    base.effective_to,
    cgc.class_group_id,
    cgc.group_short_name,
    cgc.group_long_name
FROM classes_effective_index_values_vw base
INNER JOIN classes_flattened_group_classes_vw cgc
  ON base.class_id = cgc.class_id
);--> statement-breakpoint
CREATE VIEW "classes_with_effective_index_values_vw" AS (
SELECT
  class_id,
  short_name,
  long_name,
  index_value,
  org_id,
  effective_from,
  effective_to,
  null as class_group_id,
  null as group_short_name,
  null as group_long_name
FROM classes_effective_index_values_vw
UNION
SELECT
  class_id,
  short_name,
  long_name,
  index_value,
  org_id,
  effective_from,
  effective_to,
  class_group_id,
  group_short_name,
  group_long_name
FROM classes_group_effective_index_values_vw
);