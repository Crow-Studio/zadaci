CREATE TYPE "public"."plan" AS ENUM('FREE', 'PRO');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('INACTIVE', 'ACTIVE');--> statement-breakpoint
CREATE TABLE "billing_events" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"event_type" varchar(255),
	"payload" jsonb NOT NULL,
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"subscription_status" "subscription_status" DEFAULT 'INACTIVE',
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workspace" ADD COLUMN "subscription_plan" "plan" DEFAULT 'FREE';--> statement-breakpoint
ALTER TABLE "billing_events" ADD CONSTRAINT "billing_events_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;