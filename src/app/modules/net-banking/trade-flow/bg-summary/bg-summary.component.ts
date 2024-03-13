import { Component, Input, OnInit } from "@angular/core";
import { InternetBankingService } from "../../internet-banking.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FilterBy } from "app/shared/helpers/utils";
import { bgConstant } from "./bg-summary.constant";
import { MatDialog } from "@angular/material/dialog";
import { AddNewPopupComponent } from "app/shared/components/add-new-popup/add-new-popup.component";
import { BgSummaryServiceService } from "./bg-summary-service.service";

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
  constructor(
    private route: Router,
    private bulkService: BgSummaryServiceService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // this.bgType = this.activatedRoute.snapshot.params["id"];
    this.activatedRoute.queryParamMap.subscribe((params: any) => {
      this.isSummary = true;
      this.bgType = params.get("type");
      this.maintenanceTitle = this.bgType + " Maintenance";
      this.module = this.bgType;
      if (
        this.bgType === "BG Issuance" ||
        this.bgType === "BG Amendment" ||
        this.bgType === "BG Physical"
      ) {
        this.columns = bgConstant.BGTYPE_SUMMARY;
      } else if (this.bgType === "BG Template") {
        this.columns = bgConstant.BGTEMPLATE_SUMMARY;
      }
    });
  }

  CustomGoBack(data) {
    this.route.navigate(["/user/dashboard"]);
  }
  getDataByPage(event) {
    this.page = event.page;
    this.pageSize = event.size;
    this.sortDirection = event.direction;
    this.sortValue = event.sort;
    this.filterBy = event.filterBy;
    this.module = event.module;
    this.bulkService
      .getSummaryDetails(
        event.filterBy,
        event.filterValue,
        event.page,
        event.size,
        this.sortValue,
        event.direction,
        this.bgType
      )
      .subscribe((res) => {
        this.bgData = res;
      });
  }

  openPopUp(event) {
    console.log(event, "event..........");
    const id = event.element.applicantId || event.element;
    if (id === "addNew") {
      const dialogRef = this.dialog.open(AddNewPopupComponent, {
        width: "50%",
        disableClose: true,
        panelClass: "dialog-class",
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res.templateName) {
        } else {
        }
        this.getBGType(this.bgType);
      });
    } else if (id === "bulk") {
    } else {
      console.log("having a id");
    }
  }

  getBGType(resp) {
    switch (resp) {
      case "BG Issuance":
        this.componentName = "Bg_Issuance";
        break;
      case "BG Amendment":
        this.componentName = "Bg_Amendment";
        break;
      case "BG Physical":
        this.componentName = "Bg_PhysicalAmendment";
        break;
      default:
        break;
    }

    this.route.navigate([`user/dashboard/trade/genericBg`], {
      queryParams: { type: this.componentName },
    });
  }
}
