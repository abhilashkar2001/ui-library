import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { InternetBankingService } from "../../internet-banking.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FilterBy } from "app/shared/helpers/utils";
import { bgConstant } from "./bg-summary.constant";
import { MatDialog } from "@angular/material/dialog";
import { AddNewPopupComponent } from "app/shared/components/add-new-popup/add-new-popup.component";
import { BgSummaryServiceService } from "./bg-summary-service.service";
import { DrawerConstant } from "../../new-reusable-components/custom-drawer/custom-drawer.constant";

@Component({
  selector: "app-bg-summary",
  templateUrl: "./bg-summary.component.html",
  styleUrls: ["./bg-summary.component.scss"],
})
export class BgSummaryComponent implements OnInit {
  @Input("bgType") bgType: any = "BG Issuance";
  maintenanceTitle: any;
  columns: any;
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
    data: bgConstant.bgStaticData,
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
  componentName: any;
  tradeMenus = DrawerConstant.DRAWER_MENU;
  matchedObject: any;
  summaryDetails: any;
  addNewList = bgConstant.ADDNEW_LIST;
  constructor(
    private route: Router,
    private api: BgSummaryServiceService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params: any) => {
      this.isSummary = true;
      this.bgType = params.get("type");
      this.maintenanceTitle = this.bgType;
      this.module = this.bgType;
    });
  }

  getSummaryUrl() {
    console.log(this.summaryDetails);

    return new Promise((resolve, reject) => {
      if (this.summaryDetails) resolve("summary details found");
      else
        this.api.getSummaryUrls().subscribe((resp) => {
          this.summaryDetails = resp.find(
            (element) => element.name === this.bgType
          );
          console.log(this.summaryDetails);

          this.columns = bgConstant[this.summaryDetails.columnRefName];
          this.cdr.detectChanges();
          resolve("summary details found");
        });
    });
  }

  CustomGoBack(data) {
    this.route.navigate([`${this.summaryDetails.backPath}`]);
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

  /**
   * add and edit as per action key.
   * @param event
   */
  openPopUp(event) {
    const id = event.element.applicantId || event.element;
    if (id === "addNew") {
      const dialogRef = this.dialog.open(AddNewPopupComponent, {
        width: "50%",
        disableClose: true,
        panelClass: "dialog-class",
      });
      dialogRef.afterClosed().subscribe((res) => {
        this.getBGType();
      });
    } else if (id === "bulk") {
    } else if (id === "template") {
      this.openTemplatePopup();
    } else if (id === "new") {
      this.getBGType();
    } else {
      console.log("having a id");
    }
  }

  /**
   * template popup to select it.
   */
  openTemplatePopup() {
    const dialogRef = this.dialog.open(AddNewPopupComponent, {
      width: "50%",
      disableClose: true,
      panelClass: "dialog-class",
      data: this.summaryDetails,
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.getBGType(res.templateName);
    });
  }

  /**
   * Note: if templateName is avilable then it should be send by params
   * @param template templateName or id
   */
  getBGType(template?) {
    this.route.navigate([`${this.summaryDetails.addNewPath}`], {
      queryParams: { type: this.bgType },
    });
  }
}
