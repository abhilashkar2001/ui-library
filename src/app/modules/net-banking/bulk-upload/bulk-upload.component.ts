import { Component, OnInit } from "@angular/core";
import { BulkUploadConstant } from "./add-bulk-upload/bulk.upload.constant";
import { Router } from "@angular/router";
import { FilterBy } from "app/shared/helpers/utils";
import { InternetBankingService } from "../internet-banking.service";

@Component({
  selector: "app-bulk-upload",
  templateUrl: "./bulk-upload.component.html",
  styleUrls: ["./bulk-upload.component.scss"],
})
export class BulkUploadComponent implements OnInit {
  columns: any = BulkUploadConstant.UPLOAD_SUMMARY;
  sort: any;
  size: number = 5;
  sortOrder: any;
  page: number = 1;
  pageSize: number = 5;
  sortValue = "";
  sortDirection = "";
  filterBy: FilterBy;
  module: any;
  bulkUploadData: any;
  staticData: any = {
    data: BulkUploadConstant.STATIC_SUMMARY,
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

  customGoBack() {
    this.route.navigate(["/user/dashboard/bulk-upload"]);
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
        this.bulkUploadData = res;
      });
  }
}
