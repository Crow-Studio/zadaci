ALTER TABLE "tasks_activity" DROP CONSTRAINT "tasks_activity_changed_by_workspace_members_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks_activity" ADD CONSTRAINT "tasks_activity_changed_by_workspace_members_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."workspace_members"("id") ON DELETE cascade ON UPDATE no action;