import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { environment } from "environments/environment";
import { fromEvent } from "rxjs";
import { debounceTime, map } from "rxjs/operators";
import { CreatedDurationModelComponent } from "../created-duration-model/created-duration-model.component";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { TableService } from "app/shared/services/table-service/table-service";
import { ViewExcelDocComponent } from "../view-excel-doc/view-excel-doc.component";

@Component({
  selector: "app-new-reusable-filter",
  templateUrl: "./new-reusable-filter.component.html",
  styleUrls: ["./new-reusable-filter.component.scss"],
})
export class NewReusableFilterComponent implements OnInit {
  @ViewChild("searchVal") searchVal: ElementRef;
  @Input() className;
  @Input() module;
  @Input() newFilter;
  @Input() createdBy;
  @Input() countryModuleFilter;
  @Input() stateModuleFilter;
  @Input() bulkUploadFileName;
  @Input() componentName: string = "";
  @Input() showOnlySearchTitle: string;
  @Input() requiredSpecialFields;
  @Input() excelData;

  @Output() customDataByPage = new EventEmitter<{
    filterValue;
  }>();

  @Output() customDownloadRecord = new EventEmitter<any>();
  filterFormControl: FormControl = new FormControl("");

  status: FormControl = new FormControl();
  tableHeader: any[] = [
    {
      headerDef: "debitAccount",
      headerCell: "Source Account",
    },
    {
      headerDef: "creditAccount",
      headerCell: "Destination Account",
    },
    {
      headerDef: "transferMode",
      headerCell: "Transfer Mode",
    },
    {
      headerDef: "transferType",
      headerCell: "Transfer Type",
    },
    {
      headerDef: "customerName",
      headerCell: "Full Name",
    },
    {
      headerDef: "ifscCode",
      headerCell: "IFSC Code",
    },
    {
      headerDef: "debitAmount",
      headerCell: "Amount",
    },
  ];
  tableBody: any[];

  actionDateOptions = [
    { value: "ONEDAY", label: "Today" },
    { value: "ONEWEEK", label: "Last 7 days" },
    { value: "CURRENTMONTH", label: "Current Month" },
    { value: "LASTTHREEMONTH", label: "Last 3 Month" },
    { value: "DATERANGE", label: "Select Date Range" },
  ];

  filterForm: FormGroup;
  fxFlexForCol1: number;
  private basePath = environment.microServiceURL;
  userImage = "/assets/images/profile-user.png";
  fromDate: any;
  toDate: any;
  statusOptions: any = [
    {
      authStatus: "AUTHORIZED",
      recordStatus: "OPEN",
    },
    {
      authStatus: "AUTHORIZED",
      recordStatus: "CLOSE",
    },
    {
      authStatus: "UNAUTHORIZED",
      recordStatus: "CLOSE",
    },
    {
      authStatus: "UNAUTHORIZED",
      recordStatus: "OPEN",
    },
  ];
  filteredOptions$: any[] = [];

  constructor(
    private fb: FormBuilder,
    private tableservice: TableService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
    this.matIconRegistry.addSvgIcon(
      `refresh-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/svg/refresh.svg"
      )
    );
  }

  ngOnInit(): void {
    console.log(this.componentName, "dsjjj");
    this.fxFlexForCol1 = this.newFilter ? 25 : 40;
    this.buildFormItem();
    // this.getCreatedBy();
  }

  buildFormItem() {
    this.filterForm = this.fb.group({
      // createdBy: "",
      lastUpdatedBy: "",
      createdDate: "",
      searchValue: "",
      newFilter: "",
      authStatus: "",
      recordStatus: "",
      status: "",
      fromDate: "",
      toDate: "",
      Auditstatus: "",
      savedData: "",
      requestAssignedTo: "",
      transactionStatus: "",
    });
    this.filterFormControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        const pk = this.createdBy.filter((item) => {
          return item.username.toLowerCase().includes(value.toLowerCase());
        });

        this.filteredOptions$ = [...pk];
        console.log(pk);
      });
  }

  stopClosing(event) {
    event.stopPropagation();
  }

  ngAfterViewInit() {
    if (this.searchVal) {
      fromEvent<any>(this.searchVal.nativeElement, "keyup")
        .pipe(
          map((event) => event.target.value),
          debounceTime(500)
        )
        .subscribe((value) => {
          let finalFilter = { ...this.filterForm.value, page: 1, pageSize: 5 };

          if (this.filterForm.value.createdDate == "DATERANGE") {
            this.customDataByPage.emit({
              filterValue: {
                ...this.filterForm.value,
                fromDate: this.fromDate,
                toDate: this.toDate,
                createdDate: "",
                searchValue: this.encodeURIComponent(value.trim()),
              },
            });
          } else {
            this.customDataByPage.emit({
              filterValue: {
                ...finalFilter,
                searchValue: this.encodeURIComponent(value.trim()),
              },
            });
          }
        });
    }
  }

  encodeURIComponent(str) {
    return str.replace(
      /[!'()*%#$`^&{}[\]\\|+]/g,
      (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()
    );
  }

  getFilterValueByStatus(event) {
    if (this.filterForm.value.createdDate == "DATERANGE") {
      if (event === "DATERANGE") this.openDuration();
      else {
        this.customDataByPage.emit({
          filterValue: {
            ...this.filterForm.value,
            fromDate: this.fromDate,
            toDate: this.toDate,
            createdDate: "",
          },
        });
      }
    } else {
      if (sessionStorage.getItem("fromDate")) {
        sessionStorage.removeItem("fromDate");
        sessionStorage.removeItem("toDate");
      }
      this.customDataByPage.emit({
        filterValue: {
          ...this.filterForm.value,
          authStatus: event?.authStatus,
          recordStatus: event?.recordStatus,
        },
      });
    }
  }

  getFilterValue(event) {
    if (this.filterForm.value.createdDate == "DATERANGE") {
      if (event === "DATERANGE") this.openDuration();
      else {
        this.customDataByPage.emit({
          filterValue: {
            ...this.filterForm.value,
            fromDate: this.fromDate,
            toDate: this.toDate,
            createdDate: "",
          },
        });
      }
    } else {
      if (sessionStorage.getItem("fromDate")) {
        sessionStorage.removeItem("fromDate");
        sessionStorage.removeItem("toDate");
      }
      this.customDataByPage.emit({
        filterValue: this.filterForm.value,
      });
    }
  }

  openDuration() {
    const dialogRef = this.dialog.open(CreatedDurationModelComponent, {
      width: "50%",
      height: "80%",
      disableClose: true,
      panelClass: "myapp-no-padding-dialog",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fromDate = result[0];
        this.toDate = result[1];
        this.customDataByPage.emit({
          filterValue: {
            ...this.filterForm.value,
            fromDate: result[0],
            toDate: result[1],
            createdDate: "",
          },
        });
      }
    });
  }

  clearFilter() {
    this.filterForm.reset();
    if (sessionStorage.getItem("fromDate")) {
      sessionStorage.removeItem("fromDate");
      sessionStorage.removeItem("toDate");
    }
    this.filterForm.get("authStatus").setValue("");
    this.filterForm.get("recordStatus").setValue("");
    this.customDataByPage.emit({
      filterValue: {
        ...this.filterForm.value,
        page: 1,
        pageSize: 5,
        sort: "lastUpdated",
        sortOrder: "DESC",
      },
    });
  }

  private saveFilterValuesToLocal() {
    const filterValues = {
      authStatus: "",
      recordStatus: "",
    };
  }
  getCreatedBy() {
    this.tableservice
      .getCreatedBy(this.className, this.module)
      .subscribe((resp: any) => {
        this.createdBy = resp?.data;
        this.createdBy.forEach((user: any) => {
          if (user?.profileUrl) {
            user.profileUrl = this.getFileUrl(user?.profileUrl);
          }
        });
        this.filteredOptions$ = [...this.createdBy];
      });
  }

  /**
   * if src-callback applied then show initial avatar
   * use onload callback method with param along with index
   * @param isFallback
   * @param index
   *
   */
  onLoaded(isFallback: boolean, index: number) {
    if (isFallback) {
      this.createdBy[index].profileUrl = "NOT_EXIST";
    }
  }

  getFileUrl(filePath: string): SafeResourceUrl {
    const file = `${this.basePath}${filePath}`;
    const parseFileUrl = file
      ? this.domSanitizer.bypassSecurityTrustResourceUrl(file)
      : false;
    return parseFileUrl;
  }

  clear() {
    this.filterFormControl.setValue("");
  }

  downloadRecord() {
    this.customDownloadRecord.emit();
  }

  viewExcel() {
    console.log(this.excelData);
    this.dialog.open(ViewExcelDocComponent, {
      width: "80%",
      disableClose: true,
      data: {
        tableHeader: this.tableHeader,
        tableBody: this.excelData,
        fileName: this.bulkUploadFileName,
      },
    });
  }
}
