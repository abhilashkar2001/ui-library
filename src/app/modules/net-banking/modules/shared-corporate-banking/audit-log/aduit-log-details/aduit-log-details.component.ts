import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { AuditLogService } from '../audit-log-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-aduit-log-details',
  templateUrl: './aduit-log-details.component.html',
  styleUrls: ['./aduit-log-details.component.scss'],
  providers: [DatePipe],
})
export class AduitLogDetailsComponent implements OnChanges {
  @ViewChild(MatSort) sort: MatSort | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  filterValue = '';
  dataSource = new MatTableDataSource();
  @Input() isShowCancel: any;
  @Input() dummyData: any[] = [];
  @Input() auditlogHistory: any;
  @Input() auditInfo: any;
  totalLength = 0;

  columns = [
    {
      columnDef: 'Id',
      header: 'EMP ID',
      cell: (element: any) => `${element.Id}`,
    },
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element: any) => `${element.name}`,
    },

    {
      columnDef: 'dateTime',
      header: 'Date & Time',
      cell: (element: any) => `${element.lastUpdated}`,
    },
    {
      columnDef: 'action',
      header: 'Action',
      cell: (element: any) => `${element.action}`,
    },
    {
      columnDef: 'authStatus',
      header: 'Approved',
      cell: (element: any) => `${element.authStatus}`,
    },
    {
      columnDef: 'recordStatus',
      header: 'Active Status',
      cell: (element: any) => `${element.recordStatus}`,
    },
    {
      columnDef: 'oneTimeAuth',
      header: 'Qualified',
      cell: (element: any) => `${element.oneTimeAuth}`,
    },
    {
      columnDef: 'version',
      header: 'Version',
      cell: (element: any) => `${element.version}`,
    },
  ];

  @Output() customExpand = new EventEmitter<{ action: any }>();

  constructor(
    private api: AuditLogService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges | any) {
    if (changes.auditInfo) {
      this.auditInfo = changes.auditInfo.currentValue;
      this.getAuditDetails(this.auditInfo);
    }
  }
  getAuditDetails(auditInfo: any) {
    console.log(this.auditInfo);
    if (auditInfo?.id || this.auditInfo?.id) {
      if (this.auditInfo?.id) this.auditInfo = auditInfo;
      this.api
        .getAuditLogHistory(
          auditInfo.id,
          auditInfo.className,
          auditInfo?.page ?? 1,
          auditInfo?.pageSize ?? 5,
        )
        .subscribe(
          (resp) => {
            if (resp?.data) {
              this.dummyData = [...this.getSortedHistory(resp.data.data)];
              this.totalLength = resp.data.totalCount;
              this.cdr.markForCheck();
              console.log(this.dummyData);
            }
          },
          (err) => console.error('Error: ', err),
        );
    }
  }

  getSortedHistory(data: any) {
    const array = data;
    const childArray: any = [];
    array?.forEach((element: any) => {
      childArray.push(element[0]);
    });
    return childArray.sort(
      (a: any, b: any) => Date.parse(b.lastUpdated) - Date.parse(a.lastUpdated),
    );
  }

  openDialog(action: any) {
    this.customExpand.emit({ action: action });
  }
  calculateWidth(item: any) {
    return this.auditlogHistory?.length > 2
      ? 100 / (item?.length + 1)
      : 100 / item?.length + '%';
  }
  handlePageEvent(event: any) {
    if (event?.value)
      this.getAuditDetails({
        ...this.auditInfo,
        page: event.value.page,
        pageSize: event.value.pageSize,
      });
  }
}
