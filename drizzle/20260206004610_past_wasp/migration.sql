ALTER TABLE "results_events" ADD COLUMN "season_id" uuid;--> statement-breakpoint
CREATE INDEX "results_events_season_id_idx" ON "results_events" ("season_id");--> statement-breakpoint
ALTER TABLE "results_events" ADD CONSTRAINT "results_events_season_id_results_seasons_id_fkey" FOREIGN KEY ("season_id") REFERENCES "results_seasons"("id") ON DELETE CASCADE;