import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { MatLegacyPaginator as MatPaginator } from "@angular/material/legacy-paginator";
import { MatSort } from "@angular/material/sort";
import { MatLegacyTableDataSource as MatTableDataSource } from "@angular/material/legacy-table";
import { AuditLogService } from "../audit-log-service.service";

@Component({
  selector: "app-aduit-log-details",
  templateUrl: "./aduit-log-details.component.html",
  styleUrls: ["./aduit-log-details.component.scss"],
  providers: [DatePipe],
})
export class AduitLogDetailsComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  selectedFilterIndex: number = 0;
  filterValue: string = "";
  selectedFilterBy: string;
  dataSource = new MatTableDataSource();
  displayedColumns: any;
  @Input() isShowCancel;
  // Remove this @Input when real time api integarate
  @Input() dummyData: any[] = [];
  @Input() auditlogHistory;
  @Input() auditInfo;
  totalLength: number = 0;

  columns = [
    {
      columnDef: "Id",
      header: "EMP ID",
      cell: (element: any) => `${element.Id}`,
    },
    {
      columnDef: "name",
      header: "Name",
      cell: (element: any) => `${element.name}`,
    },

    {
      columnDef: "dateTime",
      header: "Date & Time",
      cell: (element: any) => `${element.lastUpdated}`,
    },
    {
      columnDef: "action",
      header: "Action",
      cell: (element: any) => `${element.action}`,
    },
    {
      columnDef: "authStatus",
      header: "Approved",
      cell: (element: any) => `${element.authStatus}`,
    },
    {
      columnDef: "recordStatus",
      header: "Active Status",
      cell: (element: any) => `${element.recordStatus}`,
    },
    {
      columnDef: "oneTimeAuth",
      header: "Qualified",
      cell: (element: any) => `${element.oneTimeAuth}`,
    },
    {
      columnDef: "version",
      header: "Version",
      cell: (element: any) => `${element.version}`,
    },
  ];

  @Output() customExpand = new EventEmitter<{ action: any }>();

  constructor(
    private datePipe: DatePipe,
    private api: AuditLogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    //console.log("action", this.auditInfo);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.auditInfo) {
      this.auditInfo = changes.auditInfo.currentValue;
      this.getAuditDetails(this.auditInfo);
    }
  }
  getAuditDetails(auditInfo) {
    console.log(this.auditInfo);
    if (auditInfo?.id || this.auditInfo?.id) {
      if (this.auditInfo?.id) this.auditInfo = auditInfo;
      this.api
        .getAuditLogHistory(
          auditInfo.id,
          auditInfo.className,
          auditInfo?.page ?? 1,
          auditInfo?.pageSize ?? 5
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
          (err) => console.error("Error: ", err)
        );
    }
  }

  getSortedHistory(data) {
    var array = data;
    var childArray = [];
    array?.forEach((element) => {
      childArray.push(element[0]);
    });
    return childArray.sort(
      (a, b) => Date.parse(b.lastUpdated) - Date.parse(a.lastUpdated)
    );
  }

  openDialog(action) {
    this.customExpand.emit({ action: action });
  }
  calculateWidth(item) {
    return this.auditlogHistory?.length > 2
      ? 100 / (item?.length + 1)
      : 100 / item?.length + "%";
  }
  handlePageEvent(event) {
    if (event?.value)
      this.getAuditDetails({
        ...this.auditInfo,
        page: event.value.page,
        pageSize: event.value.pageSize,
      });
  }
}
