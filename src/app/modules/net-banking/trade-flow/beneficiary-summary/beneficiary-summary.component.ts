import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FilterBy } from "app/shared/helpers/utils";
import { InternetBankingService } from "../../internet-banking.service";
import { beneficiaryConstant } from "./beneficiary.constant";

@Component({
  selector: "app-beneficiary-summary",
  templateUrl: "./beneficiary-summary.component.html",
  styleUrls: ["./beneficiary-summary.component.scss"],
})
export class BeneficiarySummaryComponent implements OnInit {
  columns: any = beneficiaryConstant.BENEFICIARY_SUMMARY;
  sort: any;
  size: number = 5;
  sortOrder: any;
  page: number = 1;
  pageSize: number = 5;
  sortValue = "";
  sortDirection = "";
  filterBy: FilterBy;
  module: any;
  beneficiaryData: Object;
  staticData: any = {
    data: beneficiaryConstant.staticData,
    meta: {
      page: 1,
      size: 5,
      totalElements: 562,
      totalPages: 113,
    },
    statusCode: 200,
    status: "OK",
  };

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private bulkService: InternetBankingService
  ) {}

  ngOnInit(): void {}
  CustomGoBack(data) {
    this.route.navigate(["/user/dashboard/trade/dashboard"]);
  }
  getDataByPage(event) {
    this.page = event.page;
    this.pageSize = event.size;
    this.sortDirection = event.direction;
    this.sortValue = event.sort;
    this.filterBy = event.filterBy;
    this.module = event.module;
    this.bulkService
      .getSummary(
        event.filterBy,
        event.filterValue,
        event.page,
        event.size,
        this.sortValue,
        event.direction,
        this.module
      )
      .subscribe((res) => {
        this.beneficiaryData = res;
      });
  }

  openPopUp(event) {
    const id = event.element;
    if (id === "addNew") {
      this.route.navigate([`../add-edit-beneficiary`], {
        relativeTo: this.activatedRoute,
      });
    }
    if (id === "bulk") {
      this.route.navigate([`user/dashboard/trade/bulk-upload`, "addNew"]);
    }
  }
}
