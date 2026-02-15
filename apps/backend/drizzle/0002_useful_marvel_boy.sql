ALTER TABLE "languages" ALTER COLUMN "native_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "timezone" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "video_handles" jsonb;