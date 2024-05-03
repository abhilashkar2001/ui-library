import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EefcService } from "./eefc.service";
import { MatDialog } from "@angular/material/dialog";
import { FilterBy } from "app/shared/helpers/utils";
import { DrawerConstant } from "../../new-reusable-components/custom-drawer/custom-drawer.constant";
import { eefcConstant } from "./eefc-summary.constant";

@Component({
  selector: "app-eefc",
  templateUrl: "./eefc.component.html",
  styleUrls: ["./eefc.component.scss"],
})
export class EefcComponent implements OnInit {
  bgType: any = "BG Issuance";
  sort: any;
  size: number = 5;
  sortOrder: any;
  page: number = 1;
  pageSize: number = 5;
  sortValue = "";
  sortDirection = "";
  filterBy: FilterBy;
  module: any;
  bgData: Object;
  staticData: any = {
    data: eefcConstant.eefcStaticData,
    meta: {
      page: 1,
      size: 5,
      totalElements: 562,
      totalPages: 113,
    },
    statusCode: 200,
    status: "OK",
  };
  isSummary: boolean = true;
  filterValue = "";
  componentName: any;
  tradeMenus = DrawerConstant.DRAWER_MENU;
  matchedObject: any;
  summaryDetails: any;
  columns: any;
  addNewList = eefcConstant.ADDNEW_LIST;

  constructor(
    private route: Router,
    private api: EefcService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}
  CustomGoBack(data) {
    this.route.navigate(["/user/dashboard/trade/dashboard"]);
  }

  getDataByPage(event) {
    this.getSummaryUrl().then((_) => {
      this.page = event.page;
      this.pageSize = event.size;
      this.sortDirection = event.direction;
      this.sortValue = event.sort;
      this.filterBy = event.filterBy;
      this.module = event.module;
      this.api
        .getSummaryDetails(
          event.filterBy,
          event.filterValue,
          event.page,
          event.size,
          this.sortValue,
          event.direction,
          this.bgType,
          this.summaryDetails.summaryUrl
        )
        .subscribe((res) => {
          this.bgData = res;
        });
    });
  }

  getBenediciaryDataByage() {
    const payload = {
      filterBy: this.filterBy,
      filterValue: this.filterValue,
      page: this.page,
      size: this.pageSize,
      sort: this.sortValue,
      direction: this.sortDirection,
    };
    this.getDataByPage(payload);
  }

  getSummaryUrl() {
    return new Promise((resolve, reject) => {
      if (this.summaryDetails) resolve("summary details found");
      else
        this.api.getSummaryUrls().subscribe((resp) => {
          this.summaryDetails = resp.find(
            (element) => element.name === this.bgType
          );
          this.columns = eefcConstant[this.summaryDetails.columnRefName];
          this.cdr.detectChanges();
          console.log(this.summaryDetails);
          resolve("summary details found");
        });
    });
  }

  openPopUp(event) {
    const id = event.element;
    if (id === "addNew") {
      this.route.navigate([`../add-edit-eefc`], {
        relativeTo: this.activatedRoute,
      });
    } else {
      const id = event.element;

      this.route.navigate([`../add-edit-eefc`], {
        relativeTo: this.activatedRoute,
        // queryParams: { isEdit: "Yes", id: id.benificiaryId },
      });
    }
    if (id === "bulk") {
      this.route.navigate([`user/dashboard/trade/bulk-upload`, "addNew"]);
    }
  }
}
