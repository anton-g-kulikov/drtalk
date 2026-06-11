export type PrototypePageNumber = number | '...';

export function getPrototypePageNumbers(
  currentPage: number,
  totalPages: number
): PrototypePageNumber[] {
  const pages: PrototypePageNumber[] = [];

  if (totalPages <= 7) {
    for (let page = 1; page <= totalPages; page += 1) {
      pages.push(page);
    }
    return pages;
  }

  if (currentPage <= 4) {
    pages.push(1, 2, 3, 4, 5, '...', totalPages);
    return pages;
  }

  if (currentPage >= totalPages - 3) {
    pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    return pages;
  }

  pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
  return pages;
}
