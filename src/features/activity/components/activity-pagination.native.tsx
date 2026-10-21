import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../../design-system/colors";

type Props = { hasNext: boolean; onNext: () => void; onPrevious: () => void; pageIndex: number };

export function ActivityPagination({ hasNext, onNext, onPrevious, pageIndex }: Props) {
  return <View style={styles.container}><Pressable disabled={pageIndex === 0} onPress={onPrevious} style={[styles.button, pageIndex === 0 && styles.disabled]}><Text style={styles.buttonText}>Previous</Text></Pressable><Text style={styles.page}>Page {pageIndex + 1}</Text><Pressable disabled={!hasNext} onPress={onNext} style={[styles.button, !hasNext && styles.disabled]}><Text style={styles.buttonText}>Next</Text></Pressable></View>;
}

const styles = StyleSheet.create({ container: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 16 }, button: { alignItems: "center", backgroundColor: colors.primary, borderRadius: 10, minHeight: 44, justifyContent: "center", minWidth: 92, paddingHorizontal: 14 }, disabled: { backgroundColor: colors.border }, buttonText: { color: colors.onPrimary, fontWeight: "800" }, page: { color: colors.textMuted, fontWeight: "700" } });
