create type "public"."realm_user_roles" as enum ('owner');


  create table "public"."realm_users" (
    "realm_id" uuid not null,
    "user_id" uuid not null,
    "role" public.realm_user_roles not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."realm_users" enable row level security;


  create table "public"."realms" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."realms" enable row level security;

CREATE UNIQUE INDEX realm_users_pkey ON public.realm_users USING btree (realm_id, user_id);

CREATE UNIQUE INDEX realms_pkey ON public.realms USING btree (id);

alter table "public"."realm_users" add constraint "realm_users_pkey" PRIMARY KEY using index "realm_users_pkey";

alter table "public"."realms" add constraint "realms_pkey" PRIMARY KEY using index "realms_pkey";

alter table "public"."realm_users" add constraint "realm_users_realm_id_fkey" FOREIGN KEY (realm_id) REFERENCES public.realms(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."realm_users" validate constraint "realm_users_realm_id_fkey";

alter table "public"."realm_users" add constraint "realm_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."realm_users" validate constraint "realm_users_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_realm(realm_name text)
 RETURNS public.realms
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  new_realm realms;
begin
  insert into realms (name)
  values (realm_name)
  returning * into new_realm;

  insert into realm_users (realm_id, user_id, role)
  values (new_realm.id, auth.uid(), 'owner');

  return new_realm;
end;
$function$
;

grant delete on table "public"."realm_users" to "anon";

grant insert on table "public"."realm_users" to "anon";

grant references on table "public"."realm_users" to "anon";

grant select on table "public"."realm_users" to "anon";

grant trigger on table "public"."realm_users" to "anon";

grant truncate on table "public"."realm_users" to "anon";

grant update on table "public"."realm_users" to "anon";

grant delete on table "public"."realm_users" to "authenticated";

grant insert on table "public"."realm_users" to "authenticated";

grant references on table "public"."realm_users" to "authenticated";

grant select on table "public"."realm_users" to "authenticated";

grant trigger on table "public"."realm_users" to "authenticated";

grant truncate on table "public"."realm_users" to "authenticated";

grant update on table "public"."realm_users" to "authenticated";

grant delete on table "public"."realm_users" to "service_role";

grant insert on table "public"."realm_users" to "service_role";

grant references on table "public"."realm_users" to "service_role";

grant select on table "public"."realm_users" to "service_role";

grant trigger on table "public"."realm_users" to "service_role";

grant truncate on table "public"."realm_users" to "service_role";

grant update on table "public"."realm_users" to "service_role";

grant delete on table "public"."realms" to "anon";

grant insert on table "public"."realms" to "anon";

grant references on table "public"."realms" to "anon";

grant select on table "public"."realms" to "anon";

grant trigger on table "public"."realms" to "anon";

grant truncate on table "public"."realms" to "anon";

grant update on table "public"."realms" to "anon";

grant delete on table "public"."realms" to "authenticated";

grant insert on table "public"."realms" to "authenticated";

grant references on table "public"."realms" to "authenticated";

grant select on table "public"."realms" to "authenticated";

grant trigger on table "public"."realms" to "authenticated";

grant truncate on table "public"."realms" to "authenticated";

grant update on table "public"."realms" to "authenticated";

grant delete on table "public"."realms" to "service_role";

grant insert on table "public"."realms" to "service_role";

grant references on table "public"."realms" to "service_role";

grant select on table "public"."realms" to "service_role";

grant trigger on table "public"."realms" to "service_role";

grant truncate on table "public"."realms" to "service_role";

grant update on table "public"."realms" to "service_role";


  create policy "realm_users_delete_own"
  on "public"."realm_users"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "realm_users_delete_owner_same_realm"
  on "public"."realm_users"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.realm_users ru
  WHERE ((ru.realm_id = realm_users.realm_id) AND (ru.user_id = ( SELECT auth.uid() AS uid)) AND (ru.role = 'owner'::public.realm_user_roles)))));



  create policy "realm_users_select_owner_or_self"
  on "public"."realm_users"
  as permissive
  for select
  to authenticated
using (((( SELECT auth.uid() AS uid) = user_id) OR (EXISTS ( SELECT 1
   FROM public.realm_users ru
  WHERE ((ru.realm_id = realm_users.realm_id) AND (ru.user_id = ( SELECT auth.uid() AS uid)) AND (ru.role = 'owner'::public.realm_user_roles))))));



  create policy "realm_users_update_owner_same_realm_no_userid_change"
  on "public"."realm_users"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.realm_users ru
  WHERE ((ru.realm_id = realm_users.realm_id) AND (ru.user_id = ( SELECT auth.uid() AS uid)) AND (ru.role = 'owner'::public.realm_user_roles)))))
with check (((( SELECT auth.uid() AS uid) IS NOT NULL) AND (user_id = ( SELECT realm_users_1.user_id
   FROM public.realm_users realm_users_1
  WHERE ((realm_users_1.realm_id = realm_users_1.realm_id) AND (realm_users_1.user_id = realm_users_1.user_id))
 LIMIT 1))));



  create policy "realm_members_can_select"
  on "public"."realms"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.realm_users ru
  WHERE ((ru.realm_id = realms.id) AND (ru.user_id = ( SELECT auth.uid() AS uid))))));



  create policy "realm_members_can_update"
  on "public"."realms"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.realm_users ru
  WHERE ((ru.realm_id = realms.id) AND (ru.user_id = ( SELECT auth.uid() AS uid))))))
with check ((EXISTS ( SELECT 1
   FROM public.realm_users ru
  WHERE ((ru.realm_id = ru.realm_id) AND (ru.user_id = ( SELECT auth.uid() AS uid))))));



  create policy "realm_owners_can_delete"
  on "public"."realms"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.realm_users ru
  WHERE ((ru.realm_id = realms.id) AND (ru.user_id = ( SELECT auth.uid() AS uid)) AND (ru.role = 'owner'::public.realm_user_roles)))));
