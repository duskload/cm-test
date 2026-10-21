import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerTitleStyle: { fontWeight: "700" } }}>
      <Tabs.Screen name="balance" options={{ title: "Balance" }} />
      <Tabs.Screen name="claim" options={{ title: "Claim" }} />
      <Tabs.Screen name="activity" options={{ title: "Activity" }} />
    </Tabs>
  );
}
