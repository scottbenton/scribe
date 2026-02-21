import { Progress } from "@/components/ui";
import { useNewestRealmId } from "@/hooks/useNewestRealmId";
import { Redirect } from "wouter";
import { routes } from "../routes";

export function DefaultRealmPage() {
  const { id, isLoading, error } = useNewestRealmId();

  if (isLoading)
    return (
      <Progress.Root borderRadius={0} size="sm" value={null}>
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
    );

  if (error) {
    throw error;
  }

  if (id) {
    return <Redirect to={routes.realm(id)} />;
  } else {
    return <Redirect to={routes.createRealm} />;
  }
}
