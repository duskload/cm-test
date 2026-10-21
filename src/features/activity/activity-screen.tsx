import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";

import { colors } from "../../design-system/colors";
import { getActivity, type ActivityPage } from "./activity-api";
import { ActivityRow } from "./components/activity-row";
import { ActivityPagination } from "./components/activity-pagination";

const PAGE_LIMITS = [10, 20, 50, 100] as const;
type PageLimit = (typeof PAGE_LIMITS)[number];

export function ActivityScreen() {
  const [limit, setLimit] = useState<PageLimit>(20);
  const [cursors, setCursors] = useState<(string | null)[]>([null]);
  const [pageIndex, setPageIndex] = useState(0);
  const [page, setPage] = useState<ActivityPage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const cursor = cursors[pageIndex] ?? null;

  const loadPage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { setPage(await getActivity({ cursor, limit })); }
    catch { setError("We couldn’t load your activity. Please try again."); }
    finally { setLoading(false); }
  }, [cursor, limit]);

  useEffect(() => { void Promise.resolve().then(loadPage); }, [loadPage]);

  const selectLimit = (nextLimit: PageLimit) => {
    setLimit(nextLimit);
    setCursors([null]);
    setPageIndex(0);
    setPage(null);
  };
  const goToPrevious = () => { if (pageIndex > 0) setPageIndex((index) => index - 1); };
  const goToNext = () => {
    if (!page?.nextCursor) return;
    setCursors((currentCursors) => [...currentCursors.slice(0, pageIndex + 1), page.nextCursor!]);
    setPageIndex((index) => index + 1);
  };

  return <FlatList contentContainerStyle={styles.content} data={page?.items ?? []} keyExtractor={(item) => item.id}
    ListHeaderComponent={<View style={styles.header}><Text style={styles.title}>Activity</Text><Text style={styles.description}>Your accruals, reversals, and claims.</Text><Text style={styles.limitLabel}>Items per page</Text><View style={styles.limitList}>{PAGE_LIMITS.map((item) => <Pressable key={item} accessibilityRole="button" onPress={() => selectLimit(item)} style={[styles.limitButton, limit === item && styles.limitButtonSelected]}><Text style={[styles.limitText, limit === item && styles.limitTextSelected]}>{item}</Text></Pressable>)}</View></View>}
    ListEmptyComponent={<ActivityEmpty error={error} loading={loading} onRetry={loadPage} />}
    refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void loadPage()} tintColor={colors.primary} />}
    renderItem={({ item }) => <ActivityRow item={item} />}
    ListFooterComponent={page && page.items.length > 0 ? <ActivityPagination hasNext={Boolean(page.nextCursor)} onNext={goToNext} onPrevious={goToPrevious} pageIndex={pageIndex} /> : undefined}
    showsVerticalScrollIndicator={false}
  />;
}

function ActivityEmpty({ error, loading, onRetry }: { error: string | null; loading: boolean; onRetry: () => void }) {
  return <View style={styles.empty}>{loading ? <ActivityIndicator color={colors.primary} size="large" /> : <><Text style={styles.emptyTitle}>{error ? "Couldn’t load activity" : "No activity yet"}</Text><Text style={styles.emptyText}>{error ?? "Your accruals, reversals, and claims will appear here."}</Text>{error && <Pressable onPress={onRetry} style={styles.retry}><Text style={styles.retryText}>Try again</Text></Pressable>}</>}</View>;
}

const styles = StyleSheet.create({
  content: { backgroundColor: colors.background, flexGrow: 1, gap: 12, padding: 16, paddingBottom: 32 }, header: { marginBottom: 8 }, title: { color: colors.text, fontSize: 28, fontWeight: "800" }, description: { color: colors.textMuted, fontSize: 15, lineHeight: 22, marginTop: 6 }, limitLabel: { color: colors.text, fontSize: 13, fontWeight: "800", marginTop: 20 }, limitList: { flexDirection: "row", gap: 8, marginTop: 8 }, limitButton: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 8, borderWidth: 1, minWidth: 48, paddingHorizontal: 10, paddingVertical: 8 }, limitButtonSelected: { backgroundColor: colors.primary, borderColor: colors.primary }, limitText: { color: colors.textMuted, fontWeight: "800" }, limitTextSelected: { color: colors.onPrimary }, empty: { alignItems: "center", paddingHorizontal: 28, paddingTop: 80 }, emptyTitle: { color: colors.text, fontSize: 18, fontWeight: "800" }, emptyText: { color: colors.textMuted, fontSize: 15, lineHeight: 22, marginTop: 8, textAlign: "center" }, retry: { backgroundColor: colors.primary, borderRadius: 10, marginTop: 20, paddingHorizontal: 18, paddingVertical: 12 }, retryText: { color: colors.onPrimary, fontWeight: "800" },
});
