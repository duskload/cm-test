import { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { colors } from "../../../design-system/colors";
export function BalanceSkeleton() {
  const [opacity] = useState(() => new Animated.Value(0.45));
  useEffect(() => { const animation = Animated.loop(Animated.sequence([Animated.timing(opacity, { duration: 750, toValue: 1, useNativeDriver: true }), Animated.timing(opacity, { duration: 750, toValue: 0.45, useNativeDriver: true })])); animation.start(); return () => animation.stop(); }, [opacity]);
  return <View style={styles.screen}><Animated.View style={[styles.summary, { opacity }]}><View style={styles.shortLine} /><View style={styles.totalLine} /><View style={styles.mediumLine} /></Animated.View><Animated.View style={[styles.heading, { opacity }]} /><Animated.View style={[styles.asset, { opacity }]} /><Animated.View style={[styles.asset, { opacity }]} /></View>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1, gap: 12, padding: 16 }, summary: { backgroundColor: colors.skeleton, borderRadius: 22, gap: 16, height: 172, justifyContent: "center", padding: 24 }, shortLine: { backgroundColor: colors.skeletonHighlight, borderRadius: 4, height: 12, width: "32%" }, totalLine: { backgroundColor: colors.skeletonHighlight, borderRadius: 8, height: 42, width: "65%" }, mediumLine: { backgroundColor: colors.skeletonHighlight, borderRadius: 4, height: 12, width: "45%" }, heading: { backgroundColor: colors.skeleton, borderRadius: 4, height: 22, marginTop: 14, width: "36%" }, asset: { backgroundColor: colors.skeleton, borderRadius: 18, height: 104 },
});
