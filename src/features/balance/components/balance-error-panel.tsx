import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../../design-system/colors";
import type { BalanceErrorDetails } from "../balance-utils";

type Props = { compact?: boolean; error: BalanceErrorDetails; onRetry: () => void };

export function BalanceErrorPanel({ compact = false, error, onRetry }: Props) {
  return <View style={[styles.panel, compact && styles.compact]}><View style={styles.icon}><Text style={styles.iconText}>!</Text></View><View style={styles.copy}><Text style={styles.title}>{error.title}</Text><Text style={styles.message}>{error.message}</Text></View><Pressable accessibilityRole="button" onPress={onRetry} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}><Text style={styles.buttonText}>Try again</Text></Pressable>{!compact && <Text style={styles.helper}>Retry loading your balances when you’re ready.</Text>}</View>;
}

const styles = StyleSheet.create({
  panel: { alignItems: "center", backgroundColor: colors.warningSoft, borderColor: colors.warningBorder, borderRadius: 20, borderWidth: 1, margin: 20, padding: 22 }, compact: { alignItems: "flex-start", margin: 0, padding: 16 }, icon: { alignItems: "center", backgroundColor: colors.warning, borderRadius: 14, height: 28, justifyContent: "center", width: 28 }, iconText: { color: colors.onPrimary, fontSize: 18, fontWeight: "900" }, copy: { marginTop: 12 }, title: { color: colors.warningStrong, fontSize: 17, fontWeight: "800" }, message: { color: colors.warningStrong, fontSize: 14, lineHeight: 20, marginTop: 4 }, button: { alignItems: "center", backgroundColor: colors.warning, borderRadius: 10, minHeight: 44, justifyContent: "center", marginTop: 16, paddingHorizontal: 18 }, buttonPressed: { opacity: 0.78 }, buttonText: { color: colors.onPrimary, fontSize: 14, fontWeight: "800" }, helper: { color: colors.warningStrong, fontSize: 12, marginTop: 12, textAlign: "center" },
});
