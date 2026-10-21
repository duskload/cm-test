import ReactPaginate from "react-paginate";

import { colors } from "../../../design-system/colors";

type Props = { hasNext: boolean; onNext: () => void; onPrevious: () => void; pageIndex: number };

export function ActivityPagination({ hasNext, onNext, onPrevious, pageIndex }: Props) {
  const pageCount = pageIndex + (hasNext ? 2 : 1);
  return <ReactPaginate breakLabel="…" containerClassName="activity-pagination" forcePage={pageIndex} nextLabel="Next" onPageChange={({ selected }) => { if (selected === pageIndex + 1) onNext(); if (selected === pageIndex - 1) onPrevious(); }} pageCount={pageCount} pageRangeDisplayed={1} previousLabel="Previous" renderOnZeroPageCount={null} />;
}

void colors;
