import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-view-loan-doc',
  templateUrl: './view-loan-doc.component.html',
  styleUrls: ['./view-loan-doc.component.scss'],
})
export class ViewLoanDocComponent implements OnInit {
  fileName: string | undefined;
  tableHeader: string[] = [];
  tableBody: any[] = [];
  dataSource!: MatTableDataSource<any>;

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ViewLoanDocComponent>,
  ) {}

  ngOnInit(): void {
    this.fileName = this.data?.fileName || 'Excel Data';
    this.tableHeader = this.data?.tableHeader || [];
    this.tableBody = this.data?.tableBody || [];
    this.dataSource = new MatTableDataSource(this.tableBody);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  // Download excel
  downloadExcel(): void {
    try {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tableBody);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const excelFileName = this.fileName?.endsWith('.xlsx')
        ? this.fileName
        : `${this.fileName}.xlsx`;

      XLSX.writeFile(wb, excelFileName);
    } catch (error) {
      console.error('Error while downloading Excel:', error);
    }
  }
}
