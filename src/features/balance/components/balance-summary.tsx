import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { colors } from "../../../design-system/colors";
import { formatFreshness, formatUsd } from "../balance-utils";

type Props = { asOf?: string; isRefreshing: boolean; totalUsd: number };

export function BalanceSummary({ asOf, isRefreshing, totalUsd }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>TOTAL AVAILABLE</Text>
      <Text
        adjustsFontSizeToFit
        minimumFontScale={0.65}
        numberOfLines={1}
        style={styles.total}
      >
        {formatUsd(totalUsd)}
      </Text>
      <View style={styles.freshness}>
        <View style={[styles.dot, isRefreshing && styles.dotRefreshing]} />
        <Text style={styles.freshnessText}>
          {isRefreshing ? "Refreshing balance…" : formatFreshness(asOf)}
        </Text>
        {isRefreshing && <ActivityIndicator color={colors.onPrimaryMuted} size="small" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    minHeight: 172,
    overflow: "hidden",
    padding: 24,
  },
  eyebrow: {
    color: colors.onPrimaryMuted,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  total: {
    color: colors.onPrimary,
    fontSize: 45,
    fontWeight: "800",
    letterSpacing: -1.5,
    marginTop: 10,
  },
  freshness: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
    marginTop: 18,
  },
  dot: { backgroundColor: colors.tertiary, borderRadius: 4, height: 8, width: 8 },
  dotRefreshing: { backgroundColor: colors.onPrimaryMuted },
  freshnessText: {
    color: colors.onPrimaryMuted,
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "600",
  },
});
