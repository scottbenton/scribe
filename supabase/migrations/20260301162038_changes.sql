alter table "public"."realm_categories" drop column "name";

alter table "public"."realm_categories" add column "icon" jsonb;

alter table "public"."realm_categories" add column "label" text;

alter table "public"."realm_category_items" add column "icon" jsonb;

alter table "public"."realm_category_items" add column "notes" jsonb;

alter table "public"."realm_category_items" alter column "label" drop not null;

alter table "public"."realm_category_items" alter column "notes_text" set data type text using "notes_text"::text;


