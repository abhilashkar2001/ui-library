import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FilterBy } from "app/shared/helpers/utils";
import { beneficiaryConstant } from "./beneficiary.constant";
import { BeneficiaryService } from "./beneficiary.service";
import { InternetBankingService } from "app/shared/services/internet-banking.service";

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
  filterValue = "";
  searchValue = "";
  module: any;
  beneficiaryData: Object;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private bulkService: InternetBankingService,
    private benificiaryApi: BeneficiaryService
  ) {}

  ngOnInit(): void {}
  CustomGoBack(data) {
    this.route.navigate(["/user/trade/dashboard"]);
  }
  getDataByPage(event) {
    this.page = event.page;
    this.pageSize = event.size;
    this.sortDirection = event.direction;
    this.sortValue = event.sort;
    this.filterBy = event.filterBy;
    this.searchValue = event.searchValue;
    this.benificiaryApi
      .getDataByPage(
        event.filterBy,
        event.filterValue,
        event.page,
        event.size,
        this.sortValue,
        event.direction
      )
      .subscribe((res) => {
        this.beneficiaryData = res;
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

  openPopUp(event) {
    const id = event.element;
    if (id === "addNew") {
      this.route.navigate([`../add-edit-beneficiary`], {
        relativeTo: this.activatedRoute,
      });
    } else {
      const id = event.element;

      this.route.navigate([`../add-edit-beneficiary`], {
        relativeTo: this.activatedRoute,
        queryParams: { isEdit: "Yes", id: id.id },
      });
      console.log(id?.id);
    }
    if (id === "bulk") {
      this.route.navigate([`user/dashboard/trade/bulk-upload`, "addNew"]);
    }
  }
}
