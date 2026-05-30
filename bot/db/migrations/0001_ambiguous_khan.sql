CREATE TABLE "admin_audit" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_id" bigint,
	"action" varchar(48) NOT NULL,
	"entity" varchar(32),
	"entity_id" varchar(64),
	"meta" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "broadcast_recipients" (
	"id" serial PRIMARY KEY NOT NULL,
	"broadcast_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"tg_user_id" bigint NOT NULL,
	"status" varchar(12) DEFAULT 'pending' NOT NULL,
	"error" text,
	"sent_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "broadcasts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"message_text" text NOT NULL,
	"parse_mode" varchar(12) DEFAULT 'HTML' NOT NULL,
	"media" jsonb,
	"buttons" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"segment_type" varchar(16) NOT NULL,
	"segment_params" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" varchar(16) DEFAULT 'draft' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"total" integer DEFAULT 0 NOT NULL,
	"sent_count" integer DEFAULT 0 NOT NULL,
	"failed_count" integer DEFAULT 0 NOT NULL,
	"blocked_count" integer DEFAULT 0 NOT NULL,
	"created_by" bigint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_blocked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "unsubscribed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "broadcast_recipients" ADD CONSTRAINT "broadcast_recipients_broadcast_id_broadcasts_id_fk" FOREIGN KEY ("broadcast_id") REFERENCES "public"."broadcasts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "broadcast_recipients" ADD CONSTRAINT "broadcast_recipients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "admin_audit_created_idx" ON "admin_audit" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "broadcast_recipients_bc_status_idx" ON "broadcast_recipients" USING btree ("broadcast_id","status");--> statement-breakpoint
CREATE INDEX "broadcasts_status_idx" ON "broadcasts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "broadcasts_scheduled_idx" ON "broadcasts" USING btree ("scheduled_at");