import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ServiceCallHandler } from 'app/shared/service-call.handler';

@Component({
  selector: 'app-reusable-table',
  templateUrl: './reusable-table.component.html',
  styleUrls: ['./reusable-table.component.scss'],
})
export class ReusableTableComponent implements OnInit, OnChanges {
  displayedColumns: string[] = [];
  @Input() customerInfo: any;
  @Input() selectedAcc: any;
  @Input() showMoneyStatusIcon: any;
  @Input() columnNames: any;
  @Input() data: any;
  @Input() moreAction: any;
  @Output()
  rowClicked: EventEmitter<any> = new EventEmitter<any>();
  @Input() selectedScreen: any;
  dataSource: MatTableDataSource<any> | any;
  @Output() actionItemClicked: EventEmitter<any> = new EventEmitter<any>();
  selectedAccountInfo: any;
  @Input() selectedRowIndex = -1;

  constructor(
    private router: Router,
    private serviceCallHandler: ServiceCallHandler,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
  ) {
    this.matIconRegistry.addSvgIcon(
      'debited-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/svg/debited-icon.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'credited-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/svg/credited-icon.svg',
      ),
    );
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes.data) {
      console.log(changes.data);
      if (changes.data.currentValue) {
        this.data = changes.data.currentValue;
        this.dataSource = new MatTableDataSource(this.data);
      }
    }
    if (changes.columnNames) {
      if (changes.columnNames.currentValue) {
        this.columnNames = changes.columnNames.currentValue;
        this.displayedColumns = this.columnNames.map(
          (column: any) => column.headerDef,
        );
      }
    }
    if (changes.customerInfo) {
      if (changes.customerInfo.currentValue) {
        this.customerInfo = changes.customerInfo.currentValue;
      }
    }
    if (changes.selectedAcc) {
      if (changes.selectedAcc.currentValue) {
        this.selectedAcc = changes.selectedAcc.currentValue;
      }
    }
    this.selectedAccountInfo =
      this.customerInfo?.accounts?.[0]?.accountList.find(
        (e: any) => e.accountNo == this.selectedAcc,
      );
  }

  ngOnInit(): void {
    this.displayedColumns = this.columnNames?.map(
      (column: any) => column.headerDef,
    );
    this.dataSource = new MatTableDataSource(this.data);
  }

  onActionItemClick(element: any, item: any) {
    const clickedData = { ...element, action: item };
    this.actionItemClicked.emit(clickedData);
  }

  openRowDetails(element: any) {
    this.rowClicked.emit(element);
  }

  clickOnRepay(element: any) {
    this.serviceCallHandler.put('serviceHandler', {}, element);
    if (element.transferType == 'MMID') {
      this.router.navigate(['/send-money/dashboard/mmid-transfer']);
    } else if (element.transferType == 'Send Money Abroad') {
      this.router.navigate(['/send-money/dashboard/send-money-abroad']);
    } else if (element.transferType == 'Transfer Money') {
      this.router.navigate(['/send-money/dashboard/transfer-money']);
    }
  }
}
