import {MatPaginatorIntl} from '@angular/material/paginator';

export class PaginatorI18n {
  getPaginatorIntl(): MatPaginatorIntl {
    const paginatorIntl = new MatPaginatorIntl();
    paginatorIntl.itemsPerPageLabel = $localize`ITEMS_PER_PAGE_LABEL`;
    paginatorIntl.nextPageLabel = $localize`NEXT_PAGE_LABEL`;
    paginatorIntl.previousPageLabel = $localize`PREVIOUS_PAGE_LABEL`;
    paginatorIntl.firstPageLabel = $localize`FIRST_PAGE_LABEL`;
    paginatorIntl.lastPageLabel = $localize`LAST_PAGE_LABEL`;
    paginatorIntl.getRangeLabel = this.getRangeLabel.bind(this);
    return paginatorIntl;
  }

  private getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return $localize`RANGE_EMPTY_PAGE_LABEL`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return $localize`RANGE_PAGE_LABEL ${startIndex + 1}:startIndex: ${endIndex}:endIndex: ${length}:length:`;
  }
}
