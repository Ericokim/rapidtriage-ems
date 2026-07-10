CREATE TABLE IF NOT EXISTS "triage_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" text NOT NULL,
	"patient_name" text NOT NULL,
	"condition_description" text NOT NULL,
	"priority_level" integer NOT NULL,
	"status" text NOT NULL,
	"created_at_client" timestamp with time zone NOT NULL,
	"updated_at_client" timestamp with time zone NOT NULL,
	"synced_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "triage_records_client_id_unique" UNIQUE("client_id")
);
