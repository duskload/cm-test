import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../../design-system/colors";
import { formatAssetAmount } from "../../../design-system/number-format";
import type { Balance } from "../balance-api";
import { formatNumber } from "../balance-utils";

type Props = { balance: Balance; compact: boolean; onPress: () => void };

export function AssetBalanceRow({ balance, compact, onPress }: Props) {
  const isAvailable = parseFloat(balance?.available ?? "0") > 0;
  const isClaiming = parseFloat(balance?.claiming ?? "0") > 0;

  const status = isClaiming
    ? "Claim in progress"
    : isAvailable
      ? "Available now"
      : "Not available";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={!isAvailable}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        compact && styles.cardCompact,
        !isAvailable && styles.cardUnavailable,
        pressed && isAvailable && styles.cardPressed,
      ]}
    >
      <View style={styles.assetGroup}>
        <View style={styles.assetIcon}>
          <Text style={styles.assetInitial}>{balance.asset.slice(0, 1)}</Text>
        </View>
        <View>
          <Text style={styles.asset}>{balance.asset}</Text>
          <Text style={styles.price}>${formatNumber(balance.usdPrice)}</Text>
        </View>
      </View>
      <View style={[styles.amounts, compact && styles.amountsCompact]}>
        <Text
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          numberOfLines={1}
          style={styles.available}
        >
          {formatAssetAmount(balance.available, balance.asset)}
        </Text>
        <Text
          style={[
            styles.availableLabel,
            !isAvailable && styles.unavailableLabel,
          ]}
        >
          {status}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 104,
    padding: 16,
  },
  cardCompact: {
    alignItems: "flex-start",
    flexDirection: "column",
    gap: 14,
    height: 142,
  },
  cardPressed: { opacity: 0.76 },
  cardUnavailable: { opacity: 0.62 },
  assetGroup: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 1,
    gap: 12,
  },
  assetIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 16,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  assetInitial: {
    color: colors.primaryStrong,
    fontSize: 17,
    fontWeight: "800",
  },
  asset: { color: colors.text, fontSize: 17, fontWeight: "800" },
  price: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  amounts: { alignItems: "flex-end", flexShrink: 1, marginLeft: 12 },
  amountsCompact: { alignItems: "flex-start", marginLeft: 0, width: "100%" },
  available: { color: colors.text, fontSize: 20, fontWeight: "800" },
  availableLabel: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  unavailableLabel: { color: colors.textMuted },
});
