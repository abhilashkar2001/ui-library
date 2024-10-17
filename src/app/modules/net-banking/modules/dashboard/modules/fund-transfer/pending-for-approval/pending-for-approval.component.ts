import { Component, OnInit } from "@angular/core";
import { PendingForApprovalConstant } from "./pending-for-approval.constant";
import { Router } from "@angular/router";
import { FilterBy } from "app/shared/helpers/utils";
import { InternetBankingService } from "app/shared/services/internet-banking.service";

@Component({
  selector: "app-pending-for-approval",
  templateUrl: "./pending-for-approval.component.html",
  styleUrls: ["./pending-for-approval.component.scss"],
})
export class PendingForApprovalComponent implements OnInit {
  columns: any = PendingForApprovalConstant.PENDING_SUMMARY;
  sort: any;
  size: number = 5;
  sortOrder: any;
  page: number = 1;
  pageSize: number = 5;
  sortValue = "";
  sortDirection = "";
  filterBy: FilterBy;
  module: any;
  pendingForApprovalUpdatedData: any;
  staticData: any = {
    data: PendingForApprovalConstant.STATIC_SUMMARY,
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
    private bulkService: InternetBankingService
  ) {}

  ngOnInit(): void {}

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
        this.pendingForApprovalUpdatedData = res;
      });
  }

  editRecord(element) {
    console.log(element, "..........");
    this.route.navigate(["user/dashboard/bulk-upload", element.element.id]);
  }
}
