import { Component, OnInit } from "@angular/core";
import { bgConstant } from "../bg-summary/bg-summary.constant";
import { Router } from "@angular/router";
import { BgSummaryServiceService } from "../bg-summary/bg-summary-service.service";

@Component({
  selector: "app-pre-shipment-lp-summary",
  templateUrl: "./pre-shipment-lp-summary.component.html",
  styleUrls: ["./pre-shipment-lp-summary.component.scss"],
})
export class PreShipmentLPSummaryComponent implements OnInit {
  maintenanceTitle = "Exports Processing | Pre-Shipment Loan Process";
  EpType = "exportProcess";
  addNewList = bgConstant.ADDNEW_LIST;
  EpData: any;
  columns: any;
  summaryDetails: any;

  constructor(private route: Router, private api: BgSummaryServiceService) {}

  ngOnInit(): void {}

  CustomGoBack(event) {}
  getDataByPage(event) {
    this.getUrl().then((_: any) => {});
  }
  openPopUp(event) {
    this.route.navigate([`${this.summaryDetails.addNewPath}`], {
      queryParams: { type: this.summaryDetails.name },
    });
  }

  getUrl() {
    return new Promise((resolve, reject) => {
      if (this.summaryDetails) resolve("summary details found");
      else {
        this.api.getSummaryUrls().subscribe((resp) => {
          this.summaryDetails = resp.find(
            (e) => e.name.toLowerCase() == this.EpType.toLowerCase()
          );
          resolve("summary details found");
        });
      }
    });
  }
}
