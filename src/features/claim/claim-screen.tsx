import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";

import { colors } from "../../design-system/colors";
import { formatAssetAmount } from "../../design-system/number-format";
import { useOpenClaimDialog } from "../../common/open-claim-dialog";
import { getClaimableBalances, type ClaimableBalance } from "./claim-api";

export function ClaimScreen() {
  const [balances, setBalances] = useState<ClaimableBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const openClaimModal = useOpenClaimDialog();

  const loadBalances = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try { setBalances(await getClaimableBalances()); }
    catch { setError("We couldn’t load assets available to claim. Please try again."); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { void Promise.resolve().then(loadBalances); }, [loadBalances]);

  return <><FlatList contentContainerStyle={styles.content} data={balances} keyExtractor={(item) => item.asset}
    ListHeaderComponent={<View style={styles.header}><Text style={styles.title}>Make a claim</Text><Text style={styles.description}>Choose an available asset to claim to your wallet.</Text></View>}
    ListEmptyComponent={<View style={styles.empty}>{isLoading ? <ActivityIndicator color={colors.primary} size="large" /> : <><Text style={styles.emptyTitle}>{error ? "Couldn’t load assets" : "No assets available"}</Text><Text style={styles.emptyText}>{error ?? "Available assets will appear here when they are ready to claim."}</Text>{error && <Pressable onPress={() => void loadBalances()} style={styles.retry}><Text style={styles.retryText}>Try again</Text></Pressable>}</>}</View>}
    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => void loadBalances()} tintColor={colors.primary} />}
    renderItem={({ item }) => <ClaimableAssetRow item={item} onPress={openClaimModal} />}
  />
  </>;
}

function ClaimableAssetRow({ item, onPress }: { item: ClaimableBalance; onPress: (item: ClaimableBalance) => void }) {
  const isAvailable = Number(item.available) > 0;
  const isClaiming = Number(item.claiming) > 0;
  const status = isClaiming ? "Claim in progress" : isAvailable ? "Available to claim" : "Not available";
  return <Pressable accessibilityRole="button" disabled={!isAvailable} onPress={() => onPress(item)} style={({ pressed }) => [styles.assetCard, !isAvailable && styles.assetCardUnavailable, pressed && isAvailable && styles.assetCardPressed]}><View><Text style={styles.asset}>{item.asset}</Text><Text style={[styles.label, !isAvailable && styles.labelUnavailable]}>{status}</Text></View><View style={styles.amounts}><Text style={styles.amount}>{formatAssetAmount(item.available, item.asset)}</Text><Text style={[styles.select, !isAvailable && styles.labelUnavailable]}>{isAvailable ? "Select" : "Unavailable"}</Text></View></Pressable>;
}

const styles = StyleSheet.create({
  content: { backgroundColor: colors.background, flexGrow: 1, gap: 12, padding: 16, paddingBottom: 32 }, header: { marginBottom: 8 }, title: { color: colors.text, fontSize: 28, fontWeight: "800" }, description: { color: colors.textMuted, fontSize: 15, lineHeight: 22, marginTop: 6 },
  assetCard: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, flexDirection: "row", justifyContent: "space-between", minHeight: 88, padding: 16 }, assetCardPressed: { opacity: 0.76 }, asset: { color: colors.text, fontSize: 18, fontWeight: "800" }, label: { color: colors.textMuted, fontSize: 13, marginTop: 4 }, amounts: { alignItems: "flex-end" }, amount: { color: colors.text, fontSize: 18, fontWeight: "800" }, select: { color: colors.primaryStrong, fontSize: 13, fontWeight: "800", marginTop: 4 },
  assetCardUnavailable: { opacity: 0.62 }, labelUnavailable: { color: colors.textMuted },
  empty: { alignItems: "center", paddingHorizontal: 28, paddingTop: 100 }, emptyTitle: { color: colors.text, fontSize: 18, fontWeight: "800" }, emptyText: { color: colors.textMuted, fontSize: 15, lineHeight: 22, marginTop: 8, textAlign: "center" }, retry: { backgroundColor: colors.primary, borderRadius: 10, marginTop: 20, paddingHorizontal: 18, paddingVertical: 12 }, retryText: { color: colors.onPrimary, fontWeight: "800" },
});
