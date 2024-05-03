import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { AddNewPopupComponent } from "app/shared/components/add-new-popup/add-new-popup.component";
import { FilterBy } from "app/shared/helpers/utils";
import { DrawerConstant } from "../../new-reusable-components/custom-drawer/custom-drawer.constant";
import { BgSummaryServiceService } from "../bg-summary/bg-summary-service.service";
import { billProcessingConstants } from "./bill-processing-summary.constants";

@Component({
  selector: "app-bill-processing-summary",
  templateUrl: "./bill-processing-summary.component.html",
  styleUrls: ["./bill-processing-summary.component.scss"],
})
export class BillProcessingSummaryComponent implements OnInit {
  @Input("bgType") bgType: any = "Bill Processing";
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
    data: billProcessingConstants.billStaticData,
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
  addNewList = billProcessingConstants.ADDNEW_LIST;
  constructor(
    private route: Router,
    private api: BgSummaryServiceService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log("bill processing");

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
          console.log(resp, this.bgType);

          this.summaryDetails = resp.find(
            (element) => element.name === this.bgType
          );
          console.log(this.summaryDetails);

          this.columns =
            billProcessingConstants[this.summaryDetails.columnRefName];
          this.cdr.detectChanges();
          console.log(this.summaryDetails);
          resolve("summary details found");
        });
    });
  }

  CustomGoBack(data) {
    this.route.navigate([`${this.summaryDetails.backPath}`]);
  }

  getDataByPage(event) {
    // this.getSummaryUrl().then((_) => {
    //   this.page = event.page;
    //   this.pageSize = event.size;
    //   this.sortDirection = event.direction;
    //   this.sortValue = event.sort;
    //   this.filterBy = event.filterBy;
    //   this.module = event.module;
    //   this.api
    //     .getSummaryDetails(
    //       event.filterBy,
    //       event.filterValue,
    //       event.page,
    //       event.size,
    //       this.sortValue,
    //       event.direction,
    //       this.bgType,
    //       this.summaryDetails.summaryUrl
    //     )
    //     .subscribe((res) => {
    //       this.bgData = res;
    //     });
    // });
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
        this.getDocumentAcceptanceType();
      });
    } else if (id === "bulk") {
    } else if (id === "template") {
      this.openTemplatePopup();
    } else if (id === "new") {
      this.getDocumentAcceptanceType();
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
      this.getDocumentAcceptanceType(res.templateName);
    });
  }

  /**
   * Note: if templateName is avilable then it should be send by params
   * @param template templateName or id
   */
  getDocumentAcceptanceType(template?) {
    console.log(this.summaryDetails);

    this.route.navigate([`${this.summaryDetails.addNewPath}`], {
      queryParams: { type: this.summaryDetails.name },
    });
  }
}
