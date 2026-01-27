ALTER TABLE "classes_base" DROP CONSTRAINT "classes_base_short_name_key";--> statement-breakpoint
ALTER TABLE "classes_base" DROP CONSTRAINT "classes_base_long_name_key";--> statement-breakpoint
ALTER TABLE "classes_base" ADD CONSTRAINT "base_class_name_org_uq" UNIQUE("short_name","org_id");