import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() totalItems: any = 10; // total number of items
  @Input() tableHeaders: any;
  @Input() tableData: any;
  @Output() editRowEvent: EventEmitter<any> = new EventEmitter();
  @Output() deleteRowEvent: EventEmitter<any> = new EventEmitter();
  pageSize = 100;
  pageSizeOptions = [5, 10, 25, 50, 100];
  currentPage = 1;
  displayedColumns: any;
  dataSource!: MatTableDataSource<any>;
  constructor() {
    console.log(this.tableHeaders);
  }
  // Dynamic data array

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tableData'] && changes['tableData'].currentValue) {
      this.dataSource = new MatTableDataSource<any>(
        changes['tableData'].currentValue,
      );
      this.displayedColumns = this.tableHeaders?.map((col: any) => col.key);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.displayedColumns = this.tableHeaders?.map((col: any) => col.key);
    this.dataSource = new MatTableDataSource<any>(this.tableData);
  }

  editRow(index: number) {
    this.editRowEvent.emit(index);
  }

  deleteRow(index: number) {
    this.deleteRowEvent.emit(index);
  }

  totalPages = Math.ceil(this.totalItems / this.pageSize);

  onPageSizeChange() {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = 1;
    this.fetchPageData();
  }

  onPageChange() {
    this.fetchPageData();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchPageData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchPageData();
    }
  }

  totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getRangeText() {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalItems);
    return `${start}–${end}`;
  }

  fetchPageData() {
    console.log(
      `Fetching data for page ${this.currentPage} with pageSize ${this.pageSize}`,
    );
  }

  viewDocument() {}
}
