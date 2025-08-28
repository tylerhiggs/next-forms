ALTER TYPE "public"."field_type" ADD VALUE 'checkbox';--> statement-breakpoint
ALTER TYPE "public"."field_type" ADD VALUE 'radio';--> statement-breakpoint
ALTER TYPE "public"."field_type" ADD VALUE 'date';--> statement-breakpoint
ALTER TABLE "form_field" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "form_field" ADD CONSTRAINT "form_field_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;