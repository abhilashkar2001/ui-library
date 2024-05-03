import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { staticRemittanceData } from "../remittance-summery/remittancestaticdata";
import { FilterBy } from "app/shared/helpers/utils";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ExportSwBill } from "./export-sw-bill";
import { ExportSwBillService } from "./export-sw-bill.service";

@Component({
  selector: "app-export-sw-bill-lodgement",
  templateUrl: "./export-sw-bill-lodgement.component.html",
  styleUrls: ["./export-sw-bill-lodgement.component.scss"],
})
export class ExportSWBillLodgementComponent implements OnInit {
  @Input("bgType") bgType: any = "Export SW Bill Lodgement";
  columns: any = ExportSwBill.EXPORTSWBILL_SUMMARY;
  isSummary: boolean;
  maintenanceTitle: any;
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
    data: ExportSwBill.staticdata,
    meta: {
      page: 1,
      size: 5,
      totalElements: 3,
      totalPages: 1,
    },
    statusCode: 200,
    status: "OK",
  };
  addNewList = staticRemittanceData.ADDNEW_LIST;
  summaryDetails: any;
  constructor(
    private route: Router,
    private api: ExportSwBillService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.isSummary = true;
      this.bgType = params.get("type");
      console.log(this.bgType);
      this.maintenanceTitle = this.bgType;
      this.module = this.bgType;
    });
  }

  getDataByPage(event) {
    this.getUrl().then((_: any) => {});
  }

  getUrl() {
    console.log(this.bgType);
    return new Promise((resolve, reject) => {
      if (this.summaryDetails) resolve("summary details found");
      else {
        this.api.getSummaryUrls().subscribe((resp) => {
          console.log(resp, this.bgType);

          this.summaryDetails = resp.find(
            (e) => e.name.toLowerCase() == this.bgType.toLowerCase()
          );
          resolve("summary details found");
        });
      }
    });
  }

  /**
   * add and edit as per action key.
   * @param event
   */
  openPopUp(event) {
    this.goToBillLodgement();
  }
  goToBillLodgement() {
    console.log(this.summaryDetails);

    this.route.navigate([`${this.summaryDetails.addNewPath}`], {
      queryParams: { type: this.summaryDetails.name },
    });
  }
  CustomGoBack(data) {
    this.route.navigate([`${this.summaryDetails.backPath}`]);
  }
}
