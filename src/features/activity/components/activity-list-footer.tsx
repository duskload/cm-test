import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../../design-system/colors";
import { PAGE_LIMITS, type PageLimit } from "../activity-pagination-config";
import { ActivityPagination } from "./activity-pagination";

type Props = { hasNext: boolean; limit: PageLimit; onNext: () => void; onPrevious: () => void; onSelectLimit: (limit: PageLimit) => void; pageIndex: number };

export function ActivityListFooter({ hasNext, limit, onNext, onPrevious, onSelectLimit, pageIndex }: Props) {
  return <View style={styles.footer}><Text style={styles.label}>Items per page</Text><View style={styles.limitList}>{PAGE_LIMITS.map((item) => <Pressable key={item} accessibilityRole="button" onPress={() => onSelectLimit(item)} style={[styles.limitButton, limit === item && styles.limitButtonSelected]}><Text style={[styles.limitText, limit === item && styles.limitTextSelected]}>{item}</Text></Pressable>)}</View><ActivityPagination hasNext={hasNext} onNext={onNext} onPrevious={onPrevious} pageIndex={pageIndex} /></View>;
}

const styles = StyleSheet.create({ footer: { borderTopColor: colors.border, borderTopWidth: 1, marginTop: 16, paddingTop: 20 }, label: { color: colors.text, fontSize: 13, fontWeight: "800" }, limitList: { flexDirection: "row", gap: 8, marginTop: 8 }, limitButton: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 8, borderWidth: 1, minWidth: 48, paddingHorizontal: 10, paddingVertical: 8 }, limitButtonSelected: { backgroundColor: colors.primary, borderColor: colors.primary }, limitText: { color: colors.textMuted, fontWeight: "800" }, limitTextSelected: { color: colors.onPrimary } });
