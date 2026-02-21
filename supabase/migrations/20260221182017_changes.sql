create policy "realm_category_items_select_members"
on "public"."realm_category_items"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM public.realm_categories rc
   JOIN public.realm_users ru ON ru.realm_id = rc.realm_id
  WHERE ((rc.id = realm_category_items.category_id) AND (ru.user_id = ( SELECT auth.uid() AS uid))))));


create policy "realm_category_items_insert_members"
on "public"."realm_category_items"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.realm_categories rc
   JOIN public.realm_users ru ON ru.realm_id = rc.realm_id
  WHERE ((rc.id = realm_category_items.category_id) AND (ru.user_id = ( SELECT auth.uid() AS uid))))));


create policy "realm_category_items_update_members"
on "public"."realm_category_items"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM public.realm_categories rc
   JOIN public.realm_users ru ON ru.realm_id = rc.realm_id
  WHERE ((rc.id = realm_category_items.category_id) AND (ru.user_id = ( SELECT auth.uid() AS uid))))))
with check ((EXISTS ( SELECT 1
   FROM public.realm_categories rc
   JOIN public.realm_users ru ON ru.realm_id = rc.realm_id
  WHERE ((rc.id = realm_category_items.category_id) AND (ru.user_id = ( SELECT auth.uid() AS uid))))));


create policy "realm_category_items_delete_members"
on "public"."realm_category_items"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM public.realm_categories rc
   JOIN public.realm_users ru ON ru.realm_id = rc.realm_id
  WHERE ((rc.id = realm_category_items.category_id) AND (ru.user_id = ( SELECT auth.uid() AS uid))))));
