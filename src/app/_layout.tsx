import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { DialogRoot } from "../common/dialog-root";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
      <DialogRoot />
    </>
  );
}
