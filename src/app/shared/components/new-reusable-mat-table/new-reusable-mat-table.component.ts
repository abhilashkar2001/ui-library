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
import { MatIconRegistry } from "@angular/material/icon";
import { MatLegacyPaginator as MatPaginator } from "@angular/material/legacy-paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatLegacyTableDataSource as MatTableDataSource } from "@angular/material/legacy-table";
import { DomSanitizer } from "@angular/platform-browser";
import { TokenStorageService } from "app/shared/token-storage.service";
import { environment } from "environments/environment";
import { SCREENLIST } from "./screens";
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { NewReusableFilterComponent } from "../new-reusable-filter/new-reusable-filter.component";
import { TableService } from "app/shared/services/table-service/table-service";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
  selector: "app-new-reusable-mat-table",
  templateUrl: "./new-reusable-mat-table.component.html",
  styleUrls: ["./new-reusable-mat-table.component.scss"],
})
export class NewReusableMatTableComponent implements OnInit {
  @Input() className;
  @Input() module;
  @Input() newFilter;
  @Input() maintenanceTitle;
  @Input() subTitle;
  @Input() CountryModule = false;
  @Input() isUploadBtn = false;
  @Input() SecurityModule;
  @Input() countryModuleFilter;
  @Input() stateModuleFilter;
  @Input() columns;
  @Input() filterByOption;
  @Input() MaintenanceUpdatedData;
  @Input() UpdatedData;
  @Input() hideFilters: boolean = false;
  @Input() showOnlySearchTitle;
  @Input() requiredSpecialFields;
  @Input() addNewList = [];
  @Input() InstrumentStatusUpdatedData;
  @Input() createdBy;
  @Input() profileImage;
  @Input() isUpload: boolean;
  @Input() tellerOps: boolean = false;
  @Input() holidayTitle: string = "";
  @Input() componentName: string = "";
  @Input() showInfoIcon: boolean = false;
  @Output() customupdateRecord = new EventEmitter<{}>();
  @Output() customDownload = new EventEmitter<{}>();
  @Output() customEditForm = new EventEmitter<{ element }>();
  @Output() customDelete = new EventEmitter<{ element }>();
  @Output() customGoBack = new EventEmitter<{}>();
  @Output() customGetSortDetails = new EventEmitter<{}>();
  @Output() getPageNumber = new EventEmitter<{}>();
  @Output() getHolidaySummaryType = new EventEmitter();

  @Output() customGetDataByPage = new EventEmitter<{
    filterBy;
    filterValue;
    page: number;
    size: number;
    sort: string;
    direction: string;
    module: string;
  }>();
  @Output() customAllSelectionRecord = new EventEmitter<any>();
  @Output() customBulkUpload = new EventEmitter<any>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  holidayType = new FormControl("branch");
  selectedFilterIndex: number = 0;
  filterValue: any = "";
  selectedFilterBy: string;
  dataSource = new MatTableDataSource();
  emptyData = new MatTableDataSource([{ empty: "row" }]);
  pagesize = 5;
  totalLength = 0;
  pageIndex: number = 1;
  displayedColumns: any;
  dataObs: any;
  maintenanceData: any;
  instrumentStatus: any;
  orderBy: string;
  tablePageIndex: number;
  sortValue: string = null;
  profileKey = "userName";
  currentUser: any;
  basePath = environment.microServiceURL;
  userImage = "/assets/images/profile-user.png";
  hideClose: boolean = false;
  totalPages = 0;
  @ViewChild(NewReusableFilterComponent)
  childComponent: NewReusableFilterComponent;
  // STATIC SETUP FOR TELLER TEMPORARY
  staticBreadCrump = SCREENLIST.staticBreadCrump;
  summaryInfoResp: any[] = [];
  selection = new SelectionModel<any>(true, []);
  bulkUploadFileName: any = "";
  @Output() customDownloadRecord = new EventEmitter<any>();

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public tokenStorageService: TokenStorageService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private tableservice: TableService
  ) {
    this.matIconRegistry.addSvgIcon(
      `download-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/upload.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      `upload-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/upload.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      `auth-enabled`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/Authorize-enabled.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      `auth-disabled`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/Authorize-disabled.svg"
      )
    );
    // this.matIconRegistry.addSvgIcon(
    //   `delete-enabled`,
    //   this.domSanitizer.bypassSecurityTrustResourceUrl(
    //     "assets/images/Group 4089.svg"
    //   )
    // );
    this.matIconRegistry.addSvgIcon(
      `reopen-enabled`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/activate.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      `close-enabled`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/close_enabled.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      `transaction`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/transaction.svg"
      )
    );
  }

  ngOnInit(): void {
    console.log("requiredSpecialFields", this.requiredSpecialFields);

    if (this.holidayTitle.toLowerCase().includes("branch")) {
      this.holidayType.setValue("branch");
    } else if (this.holidayTitle.toLowerCase().includes("currency")) {
      this.holidayType.setValue("currency");
    } else if (this.holidayTitle.toLowerCase().includes("clearing")) {
      this.holidayType.setValue("clearing");
    }

    const isMatch = SCREENLIST.listOfScreens.find((screen) => {
      return screen.screenName === this.maintenanceTitle;
    });
    if (isMatch) {
      this.hideClose = isMatch ? true : false;
    }

    this.currentUser = this.tokenStorageService.getUser();

    this.displayedColumns = this.columns?.map((c) => c.columnDef);
    if (
      this.componentName != "Bulk Upload" &&
      this.componentName != "BG Template"
    )
      this.displayedColumns?.push("action");
    if (this.componentName == "Bulk Upload")
      this.displayedColumns?.unshift("checkBox");
    this.customUpdateTable(
      null,
      null,
      this.pageIndex,
      this.pagesize,
      null,
      null,
      "coprateNetBanking"
    );

    this.sortValue = "lastUpdated";
    this.orderBy = "DESC";
  }
  getData(e) {
    return e ? `${e[0]?.toUpperCase()}${e[1]?.toUpperCase()}` : "";
  }

  onHolidayTypeChange(value) {
    this.getHolidaySummaryType.emit(value);
  }

  // Get Approval Hostory
  getApprovalHistory(id: number) {
    this.tableservice.getApprovalHistory(this.className, id).subscribe(
      (resp: any) => {
        this.summaryInfoResp = resp?.data;
        this.cdr.detectChanges();
      },
      (err) => console.error("Error: ", err)
    );
  }

  /**
   * filter data receiving here.
   */
  customSearch(event: any) {
    this.filterValue = { ...event.filterValue };
    if (event.filterValue?.page) {
      this.sortValue = event.filterValue.sort;
      this.filterDataPayload(event);
    } else if (event.filterValue?.page && event.filterValue.searchValue) {
      this.filterDataPayload(event);
      this.sortValue = event.filterValue.searchValue;
    } else if (
      event.filterValue?.page &&
      event.filterValue.searchValue &&
      event.filterValue.fromDate
    ) {
      this.filterDataPayload(event);
      this.sortValue = event.filterValue.searchValue;
    } else if (
      event.filterValue.searchValue &&
      !event.filterValue?.page &&
      !event.filterValue.fromDate
    ) {
      this.sortValue = event.filterValue.searchValue;
      delete this.filterValue.page;
    }

    this.customUpdateTable(
      this.filterValue,
      this.filterValue,
      this.calculatePageIndex(),
      this.pagesize,
      this.sortValue,
      this.orderBy,
      "coprateNetBanking"
    );
  }

  filterDataPayload(event) {
    this.pageIndex = event.filterValue.page;
    this.pagesize = event.filterValue.pageSize;
    this.orderBy = event.filterValue.sortOrder;
    this.filterValue = { ...event.filterValue };
    delete this.filterValue.page;
    delete this.filterValue.sort;
    delete this.filterValue.sortOrder;
  }
  isInvalidSearchValue(searchValue) {
    return searchValue?.match(/^[^a-zA-Z0-9-!@#$&*()+._/]+$/);
  }

  handleValidSearchValue(searchValue, filterValue) {
    if (searchValue) {
      this.sortValue = searchValue;
    }

    this.filterValue = { ...filterValue };

    if (filterValue?.page) {
      this.pageIndex = filterValue.page;
      delete this.filterValue.page;
    }
  }
  bulkUpload() {
    this.customBulkUpload.emit();
  }

  calculatePageIndex() {
    return this.totalPages === this.pageIndex ? 1 : this.pageIndex;
  }

  /**
   * Open add / edit screen.
   */
  openPopUp(element) {
    this.tableservice.setEditingStatus(false);
    this.customEditForm.emit({ element });
  }
  openPopUpInstrument(element) {
    this.customEditForm.emit({ element });
  }

  /**
   * Deletion of selected record.
   */
  deleteItem(element) {
    this.customDelete.emit({ element });
  }

  /**
   * Call a customEvent in parent component.
   */
  customUpdateTable(
    selectedFilterBy,
    value,
    page,
    size,
    sortName,
    direction,
    module
  ) {
    if (sortName == "SC2") {
      sortName = "stateCode2";
    }
    console.log("inside custom");

    this.customGetDataByPage.emit({
      filterBy: value,
      filterValue: value,
      page: page,
      size: size,
      sort: sortName,
      direction: direction,
      module: module,
    });
  }

  updateColumn(data) {
    this.displayedColumns = this.columns?.map((c) => c.columnDef);
    if (
      this.componentName != "Bulk Upload" &&
      this.componentName != "BG Template"
    )
      this.displayedColumns?.push("action");
    if (this.componentName == "Bulk Upload")
      this.displayedColumns?.unshift("checkBox");
  }

  /**
   * reading maintenance api resp from respective maintenance screen.
   */
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes.columns) {
      this.updateColumn(changes.columns.currentValue);
    }
    if (changes) this.maintenanceData = changes?.UpdatedData?.currentValue;
    this.instrumentStatus = changes?.InstrumentStatusUpdatedData?.currentValue;
    if (this.maintenanceData?.data?.length > 0)
      this.bulkUploadFileName = this.maintenanceData?.data[0].fileName;

    if (this.maintenanceData?.statusCode == 200) {
      this.updateTable(
        this.componentName == "Bulk Upload"
          ? this.maintenanceData.data[0].corpFundDetails
          : this.maintenanceData.data,
        this.maintenanceData.meta
      );
    } else if (this.instrumentStatus?.statusCode === 200) {
      this.updateTable([], {});
    } else if (this.maintenanceData?.statusCode === 204) {
      this.updateTable([], {});
    } else if (this.maintenanceData == "" || this.maintenanceData == null) {
      this.updateTable([], {});
    }

    console.log(this.maintenanceData, "this.maintenanceData ");
  }

  /**
   * Updating table here.
   */
  updateTable(data: any[], meta) {
    console.log(data, meta);

    this.parseUserAvatar(data);

    this.totalLength = meta?.totalElements;
    this.tablePageIndex = meta?.page - 1;
    this.totalPages = meta?.totalPages;
  }

  /**
   * @parseUserAvatar() Method
   * @param summary array data
   * if array object has profile will update combined host before connecting to Datasource
   *
   */
  parseUserAvatar(data: any[]) {
    data?.forEach((item, i) => {
      if (item?.profile) {
        item!.profile!.fileUrl = this.getFileUrl(item?.profile?.fileUrl);
      }
    });
    this.dataSource = new MatTableDataSource(data);
  }

  /**
   * getFileUrl method
   * @param filePath
   * dynamic data fileUrl if exist combined with host else defaultImage display
   *
   */
  getFileUrl(filePath: string): any {
    const file = filePath ? `${this.basePath}${filePath}` : this.userImage;
    return file;
  }

  /**
   * Page Operation handleing here.
   */
  handlePageEvent(event: any) {
    if (
      this.pageIndex != event.page ||
      this.sortValue ||
      this.pagesize != event?.value?.pageSize
    ) {
      this.pagesize = event?.value?.pageSize | event.pageSize;
      this.pageIndex = event?.value?.page | event?.page;
      this.customUpdateTable(
        null,
        this.filterValue,
        event?.value?.page,
        event?.value?.pageSize,
        this.sortValue,
        this.orderBy,
        "coprateNetBanking"
      );
    }
  }

  /**
   * filterchange
   */
  filterChange(filterby) {
    this.selectedFilterBy = this.filterByOption.find(
      (item) => item.key == filterby
    ).key;
  }

  /**
   * Clearing the filter, and refreshing table with updated new data.
   */
  clearFilter() {
    this.dataSource.filter = "";
    this.selectedFilterIndex = 0;
    this.filterValue = "";
    this.customUpdateTable(
      null,
      null,
      1,
      this.pagesize,
      this.sortValue,
      this.orderBy,
      "coprateNetBanking"
    );
  }

  /**
   * Upload file.
   */
  onFileChange(event) {
    this.customupdateRecord.emit({ event });
  }

  /**
   * Download all summary table details.
   */
  downloadSummary(type) {
    const payload = {
      authStatus: this.filterValue?.authStatus ?? null,
      recordStatus: this.filterValue?.recordStatus ?? null,
      createdBy: this.filterValue?.createdBy ?? null,
      createdDate: this.filterValue?.createdDate ?? null,
      toDate: this.filterValue?.toDate ?? null,
      fromDate: this.filterValue?.fromDate ?? null,
      searchValue: this.filterValue?.searchValue ?? null,
      lastUpdatedBy: this.filterValue?.lastUpdatedBy ?? null,
      sort: this.sortValue ?? null,
      sortOrder: this.orderBy ?? null,
      userId: this.currentUser?.userId,
    };
    if (
      this.filterValue?.fromDate != null &&
      this.filterValue?.toDate != null
    ) {
      delete payload?.createdDate;
    } else {
      delete payload?.fromDate;
      delete payload?.toDate;
    }
    this.tableservice
      .downloadRecord(
        this.className,
        type == "xlsx" ? "excel" : type,
        payload,
        this.module
      )
      .subscribe((res) => {
        this.handleDownload(type, res);
      });
  }

  handleDownload(type, data) {
    const blob = new Blob([data], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);

    // Create a link element and simulate a click to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${this.maintenanceTitle}.${type}`;
    document.body.appendChild(link);
    link.click();

    // Cleanup the link element
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Sorting data.
   */
  announceSortChange(sortState: Sort) {
    this.sortValue = sortState.active;
    this.orderBy = sortState.direction === "asc" ? "ASC" : "DESC";
    this.customUpdateTable(
      this.selectedFilterIndex != 0 ? this.selectedFilterIndex : null,
      this.filterValue,
      this.pageIndex,
      this.pagesize,
      sortState.active,
      this.orderBy,
      "coprateNetBanking"
    );
  }
  updateRecord(operation, id, obj) {
    this.customupdateRecord.emit({ operation, id, obj });
  }

  maskEmail(email: string, length?: number): string {
    const atIndex = email.indexOf("@");
    if (atIndex > 0) {
      const maskedPart = "X".repeat(atIndex);
      const visiblePart = email.substring(atIndex);
      if (length !== 1) return (maskedPart + visiblePart).substring(0, 10);
      else return maskedPart + visiblePart;
    }
    return email;
  }

  customSort(sortValue, direction) {
    this.sortValue = sortValue;
    this.orderBy = direction.toUpperCase();

    this.customUpdateTable(
      this.filterValue,
      this.filterValue,
      this.pageIndex,
      this.pagesize,
      this.sortValue,
      this.orderBy,
      "coprateNetBanking"
    );
  }
  goBack() {
    this.customGoBack.emit({});
  }
  customroute(route?) {
    this.router.navigate([`/maintenance/dashboard`]);
  }

  getShorendValue(value, length = 15) {
    if (value) {
      let truncatedValue: any = value.toString().split(",");
      if (truncatedValue.length > 1) {
        return truncatedValue.slice(0, 3).join(",").slice(0, length) + "...";
        // return truncatedValue[0] + "...";
      } else {
        truncatedValue = truncatedValue?.[0];
        truncatedValue =
          truncatedValue.length > length
            ? `${truncatedValue.slice(0, length)}...`
            : truncatedValue;
      }

      return truncatedValue;
    }
  }

  updateActionBy() {
    this.childComponent.getCreatedBy();
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  isAllSelected() {
    this.customAllSelectionRecord.emit(this.selection.selected);
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  downloadRecord(event) {
    this.customDownloadRecord.emit();
  }
}
