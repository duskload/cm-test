import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  type ListRenderItemInfo,
  View,
} from "react-native";

import { colors } from "../../design-system/colors";
import { getActivity, type ActivityItem, type ActivityPage } from "./activity-api";
import { type PageLimit } from "./activity-pagination-config";
import { ActivityListEmpty } from "./components/activity-list-empty";
import { ActivityListFooter } from "./components/activity-list-footer";
import { ActivityListHeader } from "./components/activity-list-header";
import { ActivityRow } from "./components/activity-row";

const ACTIVITY_ROW_HEIGHT = 116;
const ROW_SEPARATOR_HEIGHT = 12;
function ActivitySeparator() { return <View style={styles.separator} />; }

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
    try {
      setPage(await getActivity({ cursor, limit }));
    } catch {
      setError("We couldn’t load your activity. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [cursor, limit]);

  useEffect(() => {
    void Promise.resolve().then(loadPage);
  }, [loadPage]);

  const selectLimit = (nextLimit: PageLimit) => {
    setLimit(nextLimit);
    setCursors([null]);
    setPageIndex(0);
    setPage(null);
  };
  const goToPrevious = () => {
    if (pageIndex > 0) setPageIndex((index) => index - 1);
  };
  const goToNext = () => {
    if (!page?.nextCursor) return;
    setCursors((currentCursors) => [
      ...currentCursors.slice(0, pageIndex + 1),
      page.nextCursor!,
    ]);
    setPageIndex((index) => index + 1);
  };
  const renderActivityItem = useCallback(
    ({ item }: ListRenderItemInfo<ActivityItem>) => <ActivityRow item={item} />,
    [],
  );
  const getItemLayout = useCallback(
    (_: ArrayLike<ActivityItem> | null | undefined, index: number) => ({
      index,
      length: ACTIVITY_ROW_HEIGHT + ROW_SEPARATOR_HEIGHT,
      offset: (ACTIVITY_ROW_HEIGHT + ROW_SEPARATOR_HEIGHT) * index,
    }),
    [],
  );

  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={page?.items ?? []}
      getItemLayout={getItemLayout}
      ItemSeparatorComponent={ActivitySeparator}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={ActivityListHeader}
      ListEmptyComponent={<ActivityListEmpty error={error} loading={loading} onRetry={loadPage} />}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={() => void loadPage()}
          tintColor={colors.primary}
        />
      }
      renderItem={renderActivityItem}
      ListFooterComponent={
        <ActivityListFooter
          hasNext={Boolean(page?.nextCursor)}
          limit={limit}
          onNext={goToNext}
          onPrevious={goToPrevious}
          pageIndex={pageIndex}
          onSelectLimit={selectLimit}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.background,
    flexGrow: 1,
    gap: 12,
    padding: 16,
    paddingBottom: 32,
  },
  separator: { height: ROW_SEPARATOR_HEIGHT },
});
