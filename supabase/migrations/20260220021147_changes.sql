drop policy "realm_users_select_owner_or_self" on "public"."realm_users";


  create table "public"."realm_categories" (
    "id" uuid not null default gen_random_uuid(),
    "realm_id" uuid not null,
    "name" text not null,
    "order" text not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."realm_categories" enable row level security;

CREATE UNIQUE INDEX realm_categories_pkey ON public.realm_categories USING btree (id);

alter table "public"."realm_categories" add constraint "realm_categories_pkey" PRIMARY KEY using index "realm_categories_pkey";

alter table "public"."realm_categories" add constraint "realm_categories_realm_id_fkey" FOREIGN KEY (realm_id) REFERENCES public.realms(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."realm_categories" validate constraint "realm_categories_realm_id_fkey";

grant delete on table "public"."realm_categories" to "anon";

grant insert on table "public"."realm_categories" to "anon";

grant references on table "public"."realm_categories" to "anon";

grant select on table "public"."realm_categories" to "anon";

grant trigger on table "public"."realm_categories" to "anon";

grant truncate on table "public"."realm_categories" to "anon";

grant update on table "public"."realm_categories" to "anon";

grant delete on table "public"."realm_categories" to "authenticated";

grant insert on table "public"."realm_categories" to "authenticated";

grant references on table "public"."realm_categories" to "authenticated";

grant select on table "public"."realm_categories" to "authenticated";

grant trigger on table "public"."realm_categories" to "authenticated";

grant truncate on table "public"."realm_categories" to "authenticated";

grant update on table "public"."realm_categories" to "authenticated";

grant delete on table "public"."realm_categories" to "service_role";

grant insert on table "public"."realm_categories" to "service_role";

grant references on table "public"."realm_categories" to "service_role";

grant select on table "public"."realm_categories" to "service_role";

grant trigger on table "public"."realm_categories" to "service_role";

grant truncate on table "public"."realm_categories" to "service_role";

grant update on table "public"."realm_categories" to "service_role";


  create policy "realm_users_select_owner_or_self"
  on "public"."realm_users"
  as permissive
  for select
  to authenticated
using (true);



