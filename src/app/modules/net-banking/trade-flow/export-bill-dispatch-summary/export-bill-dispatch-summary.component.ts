import { Component, Input, OnInit } from "@angular/core";
import { exportBillDispatchData } from "./exportbillstaticdata";
import { Router } from "@angular/router";
import { BgSummaryServiceService } from "../bg-summary/bg-summary-service.service";
import { FilterBy } from "app/shared/helpers/utils";

@Component({
  selector: "app-export-bill-dispatch-summary",
  templateUrl: "./export-bill-dispatch-summary.component.html",
  styleUrls: ["./export-bill-dispatch-summary.component.scss"],
})
export class ExportBillDispatchSummaryComponent implements OnInit {
  @Input("bgType") bgType: any = "Export Bill Dispatch Request";
  columns: any = exportBillDispatchData.EXPORTBILL_SUMMARY;
  summaryDetails: any;
  addNewList = exportBillDispatchData.ADDNEW_LIST;

  module: any;
  sort: any;
  size: number = 5;
  sortOrder: any;
  page: number = 1;
  pageSize: number = 5;
  sortValue = "";
  sortDirection = "";
  filterBy: FilterBy;
  bgData: Object;
  staticData: any = {
    data: exportBillDispatchData.staticdata,
    meta: {
      page: 1,
      size: 5,
      totalElements: 562,
      totalPages: 113,
    },
    statusCode: 200,
    status: "OK",
  };

  constructor(private route: Router, private api: BgSummaryServiceService) {}

  ngOnInit(): void {}

  getUrl() {
    return new Promise((resolve, reject) => {
      if (this.summaryDetails) resolve("summary details found");
      else {
        this.api.getSummaryUrls().subscribe((resp) => {
          this.summaryDetails = resp.find(
            (e) => e.name.toLowerCase() == this.bgType.toLowerCase()
          );
          resolve("summary details found");
        });
      }
    });
  }

  goToExportBill() {
    console.log(this.summaryDetails);

    this.route.navigate([`${this.summaryDetails.addNewPath}`], {
      queryParams: { type: this.summaryDetails.name },
    });
  }

  getDataByPage(event) {
    this.getUrl().then((_: any) => {});
  }

  CustomGoBack(data) {
    this.route.navigate([`${this.summaryDetails.backPath}`]);
  }

  openPopUp(event) {
    this.route.navigate(["/user/dashboard/trade/export-bill-dispatch"]);
  }
}
