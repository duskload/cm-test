import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../../design-system/colors";

export function ActivityListHeader() {
  return <View style={styles.header}><Text style={styles.title}>Activity</Text><Text style={styles.description}>Your accruals, reversals, and claims.</Text></View>;
}

const styles = StyleSheet.create({ header: { marginBottom: 20 }, title: { color: colors.text, fontSize: 28, fontWeight: "800" }, description: { color: colors.textMuted, fontSize: 15, lineHeight: 22, marginTop: 6 } });
