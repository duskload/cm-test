import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  type ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { colors } from "../../design-system/colors";
import { useOpenClaimDialog } from "../../common/open-claim-dialog";
import { getBalances, type Balance, type BalanceSnapshot } from "./balance-api";
import { describeBalanceError, totalAvailableUsd } from "./balance-utils";
import { AssetBalanceRow } from "./components/asset-balance-row";
import { BalanceErrorPanel } from "./components/balance-error-panel";
import { BalanceSkeleton } from "./components/balance-skeleton";
import { BalanceSummary } from "./components/balance-summary";

const DEFAULT_ROW_HEIGHT = 104;
const COMPACT_ROW_HEIGHT = 142;
const ROW_SEPARATOR_HEIGHT = 12;

type HeaderProps = { error: unknown; isRefreshing: boolean; asOf?: string; onRetry: () => void; totalUsd: number };

function BalanceListHeader({ asOf, error, isRefreshing, onRetry, totalUsd }: HeaderProps) {
  return <View style={styles.header}><BalanceSummary asOf={asOf} isRefreshing={isRefreshing} totalUsd={totalUsd} />{Boolean(error) && <BalanceErrorPanel compact error={describeBalanceError(error)} onRetry={onRetry} />}<Text style={styles.sectionTitle}>Your assets</Text><Text style={styles.sectionDescription}>Amounts currently available to claim.</Text></View>;
}

function EmptyBalances() {
  return <View style={styles.empty}><Text style={styles.emptyTitle}>No balances yet</Text><Text style={styles.emptyText}>Your available assets will appear here.</Text></View>;
}

function AssetSeparator() { return <View style={styles.separator} />; }

export function BalanceScreen() {
  const { width } = useWindowDimensions();
  const [snapshot, setSnapshot] = useState<BalanceSnapshot | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const openClaimModal = useOpenClaimDialog();
  const isCompact = width < 360;
  const totalUsd = useMemo(
    () => totalAvailableUsd(snapshot?.items ?? []),
    [snapshot?.items],
  );
  const loadBalances = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSnapshot(await getBalances());
    } catch (caughtError) {
      setError(caughtError);
    } finally {
      setLoading(false);
    }
  }, []);
  const rowHeight = isCompact ? COMPACT_ROW_HEIGHT : DEFAULT_ROW_HEIGHT;
  const renderBalanceItem = useCallback(({ item }: ListRenderItemInfo<Balance>) => <AssetBalanceRow balance={item} compact={isCompact} onPress={() => openClaimModal(item)} />, [isCompact, openClaimModal]);
  const getItemLayout = useCallback((_: ArrayLike<Balance> | null | undefined, index: number) => ({ index, length: rowHeight + ROW_SEPARATOR_HEIGHT, offset: (rowHeight + ROW_SEPARATOR_HEIGHT) * index }), [rowHeight]);

  useEffect(() => {
    void Promise.resolve().then(loadBalances);
    const interval = setInterval(() => void loadBalances(), 15_000);
    return () => clearInterval(interval);
  }, [loadBalances]);

  if (!snapshot && loading) return <BalanceSkeleton />;
  
  if (!snapshot && error)
    return (
      <BalanceErrorPanel
        error={describeBalanceError(error)}
        onRetry={loadBalances}
      />
    );

  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={snapshot?.items ?? []}
      keyExtractor={(item) => item.asset}
      getItemLayout={getItemLayout}
      ItemSeparatorComponent={AssetSeparator}
      ListEmptyComponent={EmptyBalances}
      ListHeaderComponent={<BalanceListHeader asOf={snapshot?.asOf} error={error} isRefreshing={loading} onRetry={loadBalances} totalUsd={totalUsd} />}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={() => void loadBalances()}
          tintColor={colors.onPrimary}
        />
      }
      renderItem={renderBalanceItem}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.background,
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
  },
  header: { gap: 12, marginBottom: 4 },
  separator: { height: ROW_SEPARATOR_HEIGHT },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 12,
  },
  sectionDescription: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: -6,
  },
  empty: { alignItems: "center", paddingHorizontal: 24, paddingTop: 72 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: "800" },
  emptyText: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: "center",
  },
});
