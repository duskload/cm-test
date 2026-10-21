import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../../design-system/colors";

type Props = { error: string | null; loading: boolean; onRetry: () => void };

export function ActivityListEmpty({ error, loading, onRetry }: Props) {
  return <View style={styles.empty}>{loading ? <ActivityIndicator color={colors.primary} size="large" /> : <><Text style={styles.title}>{error ? "Couldn’t load activity" : "No activity yet"}</Text><Text style={styles.message}>{error ?? "Your accruals, reversals, and claims will appear here."}</Text>{error && <Pressable onPress={onRetry} style={styles.retry}><Text style={styles.retryText}>Try again</Text></Pressable>}</>}</View>;
}

const styles = StyleSheet.create({ empty: { alignItems: "center", paddingHorizontal: 28, paddingTop: 60 }, title: { color: colors.text, fontSize: 18, fontWeight: "800" }, message: { color: colors.textMuted, fontSize: 15, lineHeight: 22, marginTop: 8, textAlign: "center" }, retry: { backgroundColor: colors.primary, borderRadius: 10, marginTop: 20, paddingHorizontal: 18, paddingVertical: 12 }, retryText: { color: colors.onPrimary, fontWeight: "800" } });
