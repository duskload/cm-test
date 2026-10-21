import ReactPaginate from "react-paginate";

import "./activity-pagination.web.css";

type Props = { hasNext: boolean; onNext: () => void; onPageSelect: (index: number) => void; onPrevious: () => void; pageIndex: number };

export function ActivityPagination({ hasNext, onNext, onPageSelect, onPrevious, pageIndex }: Props) {
  const pageCount = pageIndex + (hasNext ? 2 : 1);
  return <ReactPaginate activeClassName="selected" breakLabel="…" containerClassName="activity-pagination" disabledClassName="disabled" forcePage={pageIndex} nextLabel="Next" onPageChange={({ selected }) => { if (selected <= pageIndex) onPageSelect(selected); if (selected === pageIndex + 1) onNext(); }} pageCount={pageCount} pageRangeDisplayed={1} previousLabel="Previous" renderOnZeroPageCount={null} />;
}
