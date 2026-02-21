import { useUsersRealms } from "@/hooks/useUsersRealms";
import * as Select from "@/components/ui/select";
import { createListCollection } from "@ark-ui/react/select";
import { useLocation } from "wouter";
import { routes } from "@/routes/routes";
import { useRealmId } from "../../hooks/useRealmId";
import { Box } from "styled-system/jsx";
import { PlusIcon } from "lucide-react";

export function ChooseRealm() {
  const { realms, isLoading, error } = useUsersRealms();
  const [, navigate] = useLocation();

  const realmId = useRealmId();

  const collection = createListCollection({
    items: realms ?? [],
    itemToValue: (realm) => realm.id,
    itemToString: (realm) => realm.name,
  });

  if (isLoading) {
    return <Box h={10} />;
  }

  return (
    <Select.Root
      value={[realmId]}
      collection={collection}
      onValueChange={({ value }) => {
        if (value[0]) navigate(routes.realm(value[0]));
      }}
      variant={"subtle" as any}
    >
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Choose realm" />
          <Select.Indicator />
        </Select.Trigger>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {isLoading && (
            <Select.ItemGroup>
              <Select.ItemGroupLabel>Loading...</Select.ItemGroupLabel>
            </Select.ItemGroup>
          )}
          {error && (
            <Select.ItemGroup>
              <Select.ItemGroupLabel>
                Failed to load realms
              </Select.ItemGroupLabel>
            </Select.ItemGroup>
          )}
          {!isLoading && !error && (
            <Select.ItemGroup>
              {collection.items.map((realm) => (
                <Select.Item key={realm.id} item={realm}>
                  <Select.ItemText>{realm.name}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.ItemGroup>
          )}
          <Select.Context>
            {({ setOpen }) => (
              <Select.ItemGroup>
                <Select.Item
                  color="primary.surface.fg"
                  item={{ value: "__create__", label: "Create Realm" }}
                  onClick={() => {
                    setOpen(false);
                    navigate(routes.createRealm);
                  }}
                >
                  <Select.ItemText>Create Realm</Select.ItemText>
                  <PlusIcon />
                </Select.Item>
              </Select.ItemGroup>
            )}
          </Select.Context>
        </Select.Content>
      </Select.Positioner>
      <Select.HiddenSelect />
    </Select.Root>
  );
}
