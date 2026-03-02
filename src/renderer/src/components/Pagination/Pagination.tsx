import * as React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../ui/pagination';

interface Props {
  page: number;
  pages: number;
  /* eslint-disable */
  setPage: (_: number) => void;
  /* eslint-enable */
}

export default function PaginationUtility({ page, pages, setPage }: Props): React.ReactNode {
  return (
    <>
      {pages > 1 && (
        <Pagination>
          <PaginationContent>
            {/* PREV */}
            {page > 1 && (
              <PaginationItem className="cursor-pointer">
                <PaginationPrevious className="cursor-pointer" onClick={() => setPage(page - 1)} />
              </PaginationItem>
            )}

            {page > 2 && (
              <PaginationItem className="cursor-pointer">
                <PaginationEllipsis className="cursor-pointer" />
              </PaginationItem>
            )}

            {page > 1 && (
              <PaginationItem className="cursor-pointer">
                <PaginationLink className="cursor-pointer" onClick={() => setPage(page - 1)}>
                  {page - 1}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem className="cursor-pointer">
              <PaginationLink isActive className="cursor-pointer">
                {page}
              </PaginationLink>
            </PaginationItem>

            {pages > 2 && page !== pages && (
              <PaginationItem className="cursor-pointer">
                <PaginationLink className="cursor-pointer" onClick={() => setPage(page + 1)}>
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* ... */}
            {page !== pages && page !== pages - 1 && (
              <PaginationItem className="cursor-pointer">
                <PaginationEllipsis className="cursor-pointer" />
              </PaginationItem>
            )}

            {/* NEXT BTN */}
            {page < pages && (
              <PaginationItem className="cursor-pointer">
                <PaginationNext className="cursor-pointer" onClick={() => setPage(page + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
