create or replace function create_realm(realm_name text)
returns realms
language plpgsql
security definer  -- runs as the function owner, bypassing RLS
set search_path = public
as $$
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
$$;