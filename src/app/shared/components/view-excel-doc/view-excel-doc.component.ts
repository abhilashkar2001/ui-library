import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-view-excel-doc',
  templateUrl: './view-excel-doc.component.html',
  styleUrls: ['./view-excel-doc.component.scss'],
})
export class ViewExcelDocComponent implements OnInit {
  excelData: any;
  fileName: string | undefined;
  tableHeader: any;
  tableBody: any;
  dataSource: MatTableDataSource<any> | any;
  displayedColumns: string[] | any;
  @ViewChild('paginator') paginator: MatPaginator | any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ViewExcelDocComponent>,
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.tableBody = this.data?.tableBody;
    this.tableHeader = this.data?.tableHeader;
    this.fileName = this.data?.fileName;
    this.dataSource = new MatTableDataSource(this.tableBody);
    this.dataSource.paginator = this.paginator;

    this.displayedColumns = this.tableHeader.map(
      (header: any) => header.headerCell,
    );
    console.log(this.displayedColumns);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
