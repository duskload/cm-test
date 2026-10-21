import { StyleSheet, Text, View } from "react-native";

export function ActivityScreen() { return <View style={styles.screen}><Text style={styles.title}>Activity</Text></View>; }
const styles = StyleSheet.create({ screen: { alignItems: "center", flex: 1, justifyContent: "center" }, title: { fontSize: 24, fontWeight: "700" } });
