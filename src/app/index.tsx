import { Redirect } from "expo-router";
import { useCallback, useSyncExternalStore } from "react";

import { useAuthStore } from "../stores/auth-store";

export default function Index() {
  const subscribeToHydration = useCallback(
    (onStoreChange: () => void) => useAuthStore.persist.onFinishHydration(onStoreChange),
    [],
  );
  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    useAuthStore.persist.hasHydrated,
    () => false,
  );
  const apiToken = useAuthStore((state) => state.apiToken);

  if (!hasHydrated) return null;
  return <Redirect href={apiToken ? "/balance" : "/onboarding"} />;
}
