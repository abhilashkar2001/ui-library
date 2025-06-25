import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent implements AfterViewInit {
  tableHeaders = [
    { key: 'collateralName', label: 'Collateral Name' },
    { key: 'ownership', label: 'Ownership of the collateral' },
    { key: 'assetWorth', label: 'Asset Monetary Worth' },
    { key: 'description', label: 'Description of Collateral' },
    { key: 'document', label: 'Document Upload' },
    { key: 'action', label: 'Action' },
  ];

  // Dynamic data array
  tableData = [
    {
      collateralName: 'Credit Card Details',
      ownership: 'Self',
      assetWorth: '3,00,000',
      description:
        'Detailed information regarding the collateral, including usage history.',
    },
    {
      collateralName: 'VAF Details',
      ownership: 'Self',
      assetWorth: '3,00,000',
      description: 'Detailed information regarding vehicle ownership details.',
    },
    {
      collateralName: 'Credit Card Details',
      ownership: 'Self',
      assetWorth: '3,00,000',
      description:
        'Detailed information regarding the collateral, including usage history.',
    },
    {
      collateralName: 'VAF Details',
      ownership: 'Self',
      assetWorth: '3,00,000',
      description: 'Detailed information regarding vehicle ownership details.',
    },
  ];

  displayedColumns = this.tableHeaders.map((col) => col.key);
  dataSource = new MatTableDataSource<any>(this.tableData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  editRow(row: any) {
    console.log('Editing', row);
  }

  deleteRow(row: any) {
    console.log('Deleting', row);
  }
}
