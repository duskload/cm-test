import { Redirect } from "expo-router";

import { useAuthStore } from "../stores/auth-store";

export default function Index() {
  const hasHydrated = useAuthStore.persist.hasHydrated();
  const apiToken = useAuthStore((state) => state.apiToken);

  if (!hasHydrated) return null;
  return <Redirect href={apiToken ? "/balance" : "/onboarding"} />;
}
