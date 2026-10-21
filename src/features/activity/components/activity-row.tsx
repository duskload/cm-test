import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../../design-system/colors";
import { formatAssetAmount } from "../../../design-system/number-format";
import type { ActivityItem } from "../activity-api";

export function ActivityRow({ item }: { item: ActivityItem }) {
  const isNegative = Number(item.amount) < 0 || item.type === "reversal" || item.type === "claim";
  const displayAmount = `${isNegative ? "−" : "+"}${formatAssetAmount(Math.abs(Number(item.amount)), item.asset)} ${item.asset}`;
  return <View style={styles.card}><View style={styles.top}><View><Text style={styles.type}>{item.type}</Text><Text style={styles.metadata}>{item.exchange ?? "Claim"}</Text></View><Text style={[styles.amount, isNegative && styles.negative]}>{displayAmount}</Text></View><View style={styles.bottom}><Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text><StatusBadge status={item.status} /></View></View>;
}

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();
  const isComplete = normalizedStatus === "confirmed" || normalizedStatus === "completed";
  const isFailed = normalizedStatus === "failed";
  return <View style={[styles.badge, isComplete && styles.completeBadge, isFailed && styles.failedBadge]}><Text style={[styles.badgeText, isComplete && styles.completeText, isFailed && styles.failedText]}>{status}</Text></View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, marginBottom: 12, padding: 16 }, top: { flexDirection: "row", justifyContent: "space-between" }, type: { color: colors.text, fontSize: 16, fontWeight: "800", textTransform: "capitalize" }, metadata: { color: colors.textMuted, fontSize: 13, marginTop: 4 }, amount: { color: colors.secondary, fontSize: 16, fontWeight: "800", marginLeft: 12, textAlign: "right" }, negative: { color: colors.warning }, bottom: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 14 }, date: { color: colors.textMuted, flexShrink: 1, fontSize: 12 }, badge: { backgroundColor: colors.primarySoft, borderRadius: 20, marginLeft: 12, paddingHorizontal: 9, paddingVertical: 4 }, completeBadge: { backgroundColor: colors.secondarySoft }, failedBadge: { backgroundColor: colors.warningSoft }, badgeText: { color: colors.primaryStrong, fontSize: 12, fontWeight: "800", textTransform: "capitalize" }, completeText: { color: colors.secondary }, failedText: { color: colors.warningStrong },
});
