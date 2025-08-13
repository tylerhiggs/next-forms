CREATE TYPE "public"."field_type" AS ENUM('text', 'email', 'number', 'select', 'textarea');--> statement-breakpoint
CREATE TABLE "field_answer" (
	"id" integer PRIMARY KEY NOT NULL,
	"submission_id" integer NOT NULL,
	"field_id" integer NOT NULL,
	"value" text
);
--> statement-breakpoint
CREATE TABLE "form" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_field" (
	"id" integer PRIMARY KEY NOT NULL,
	"form_id" integer NOT NULL,
	"label" text NOT NULL,
	"type" "field_type" NOT NULL,
	"required" boolean DEFAULT false,
	"options" text,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_submission" (
	"id" integer PRIMARY KEY NOT NULL,
	"form_id" integer NOT NULL,
	"submitted_at" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "field_answer" ADD CONSTRAINT "field_answer_submission_id_form_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."form_submission"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "field_answer" ADD CONSTRAINT "field_answer_field_id_form_field_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."form_field"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_field" ADD CONSTRAINT "form_field_form_id_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."form"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_submission" ADD CONSTRAINT "form_submission_form_id_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."form"("id") ON DELETE no action ON UPDATE no action;