
  create table "public"."realm_category_items" (
    "id" uuid not null default gen_random_uuid(),
    "category_id" uuid not null,
    "label" text not null,
    "order" text not null,
    "notes_text" jsonb,
    "field_contents" jsonb not null default '{}'::jsonb,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."realm_category_items" enable row level security;

CREATE UNIQUE INDEX realm_category_items_pkey ON public.realm_category_items USING btree (id);

alter table "public"."realm_category_items" add constraint "realm_category_items_pkey" PRIMARY KEY using index "realm_category_items_pkey";

alter table "public"."realm_category_items" add constraint "realm_category_items_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.realm_categories(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."realm_category_items" validate constraint "realm_category_items_category_id_fkey";

grant delete on table "public"."realm_category_items" to "anon";

grant insert on table "public"."realm_category_items" to "anon";

grant references on table "public"."realm_category_items" to "anon";

grant select on table "public"."realm_category_items" to "anon";

grant trigger on table "public"."realm_category_items" to "anon";

grant truncate on table "public"."realm_category_items" to "anon";

grant update on table "public"."realm_category_items" to "anon";

grant delete on table "public"."realm_category_items" to "authenticated";

grant insert on table "public"."realm_category_items" to "authenticated";

grant references on table "public"."realm_category_items" to "authenticated";

grant select on table "public"."realm_category_items" to "authenticated";

grant trigger on table "public"."realm_category_items" to "authenticated";

grant truncate on table "public"."realm_category_items" to "authenticated";

grant update on table "public"."realm_category_items" to "authenticated";

grant delete on table "public"."realm_category_items" to "service_role";

grant insert on table "public"."realm_category_items" to "service_role";

grant references on table "public"."realm_category_items" to "service_role";

grant select on table "public"."realm_category_items" to "service_role";

grant trigger on table "public"."realm_category_items" to "service_role";

grant truncate on table "public"."realm_category_items" to "service_role";

grant update on table "public"."realm_category_items" to "service_role";


