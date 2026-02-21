create policy "realm_categories_select_members"
on "public"."realm_categories"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM public.realm_users ru
  WHERE ((ru.realm_id = realm_categories.realm_id) AND (ru.user_id = ( SELECT auth.uid() AS uid))))));


create policy "realm_categories_insert_members"
on "public"."realm_categories"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.realm_users ru
  WHERE ((ru.realm_id = realm_categories.realm_id) AND (ru.user_id = ( SELECT auth.uid() AS uid))))));


create policy "realm_categories_update_members"
on "public"."realm_categories"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM public.realm_users ru
  WHERE ((ru.realm_id = realm_categories.realm_id) AND (ru.user_id = ( SELECT auth.uid() AS uid))))))
with check ((EXISTS ( SELECT 1
   FROM public.realm_users ru
  WHERE ((ru.realm_id = realm_categories.realm_id) AND (ru.user_id = ( SELECT auth.uid() AS uid))))));


create policy "realm_categories_delete_members"
on "public"."realm_categories"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM public.realm_users ru
  WHERE ((ru.realm_id = realm_categories.realm_id) AND (ru.user_id = ( SELECT auth.uid() AS uid))))));
