import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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
}
