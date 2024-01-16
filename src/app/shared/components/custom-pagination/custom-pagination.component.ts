import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export interface PaginationValue {
  page: number;
  pageSize: number;
}
@Component({
  selector: "app-custom-pagination",
  templateUrl: "./custom-pagination.component.html",
  styleUrls: ["./custom-pagination.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomPaginationComponent),
      multi: true,
    },
  ],
})
export class CustomPaginationComponent
  implements OnInit, OnChanges, ControlValueAccessor
{
  @Input() value: PaginationValue = { page: 1, pageSize: 5 };
  @Input() total;
  @Input() filterValue;
  @Input() visibleRangeLength = 5;
  @Input() pageSizes: number[] = [5, 10, 25, 50];
  @Output() customPageEvent = new EventEmitter<{}>();
  currentPage: number;
  pageAction: string;
  selectedSize: number = 5;
  onChange(value: any) {}
  onTouched() {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: PaginationValue): void {
    if (!value) return;

    this.value = value;
    this.updateTotalPages();
    this.updateVisiblePages();
  }

  totalPages: number = 20;
  visiblePages: any;
  totalRecords: number = 0;
  lastrecord: number = 0;
  firstRecord: number = 0;

  ngOnInit(): void {
    // this.updateRecord(this.totalPages, this.value.pageSize, 1);
    this.updateVisiblePages();
    if(sessionStorage.getItem('fromDate')){
      sessionStorage.removeItem('fromDate');
      sessionStorage.removeItem('toDate');
      }
  }

  updateRecord(totalPages, pageSize, page) {
    this.totalRecords = this.total;
    this.customPageEvent.emit({ value: this.value, page: page });
    this.lastrecord = totalPages == page ? this.total : pageSize * page;
    this.firstRecord = pageSize * (page - 1) + 1;
  }

  applyReset(totalPages, pageSize, page) {
    this.lastrecord = totalPages == page ? this.total : pageSize * page;
    this.firstRecord = pageSize * (page - 1) + 1;
    this.totalRecords = this.total;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.total || changes.value) {
      this.total = changes.total.currentValue;
      this.totalRecords = this.total;
      this.updateTotalPages();
      this.applyReset(this.totalPages, this.value.pageSize, 1);
      this.updateVisiblePages();
    }
    if (changes.filterValue) {
      this.currentPage = 1;
      if (changes?.filterValue?.currentValue?.pageSize) {
        this.selectedSize = changes?.filterValue?.currentValue?.pageSize;
      }
      this.value = {
        ...this.value,
        page: 1,
        pageSize:
          changes?.filterValue?.currentValue?.pageSize || this.selectedSize,
      };
      this.updateTotalPages();
      this.applyReset(this.totalPages, this.value.pageSize, 1);
      this.updateVisiblePages();
    }
  }

  selectPage(page: number, action: string) {
    this.pageAction = action;
    this.value = { ...this.value, page };
    // this.customPageEvent.emit({...this.value})
    this.updateRecord(this.totalPages, this.value.pageSize, this.value.page);
    this.currentPage = page;
    this.updateVisiblePages();
    this.onChange(this.value);
    const customtable = document.querySelector("#customtable");
    customtable.scrollTo(0, 0);
  }

  selectPageSize(pageSize) {
    this.value = { page: 1, pageSize: +pageSize.value };
    this.selectedSize = pageSize.value;
    this.updateTotalPages();
    this.updateRecord(this.totalPages, this.value.pageSize, this.value.page);
    this.updateVisiblePages();
    this.onChange(this.value);
  }

  updateVisiblePages(): void {
    const length = Math.min(this.totalPages, this.visibleRangeLength);
    const startIndex = Math.max(
      Math.min(
        this.value.page - Math.ceil(length / 2),
        this.totalPages - length
      ),
      0
    );
    if (length > 0) {
      this.visiblePages = Array.from(
        new Array(length).keys(),
        (item) => item + startIndex + 1
      );
      if (
        this.currentPage != this.totalPages &&
        this.currentPage != this.totalPages - 1 &&
        this.currentPage != this.totalPages - 2 &&
        this.visiblePages[this.visiblePages.length - 1] != this.totalPages
      ) {
        if(this.totalPages > 6){
          this.visiblePages.push("...");
        }
        this.visiblePages.push(this.totalPages);
      }
    } else if (length == 0) this.visiblePages = [];
  }

  updateTotalPages(): void {
    this.totalPages = Math.ceil(this.total / this.value.pageSize);
    if (isNaN(this.totalPages)) this.totalPages = 0;
  }
}
