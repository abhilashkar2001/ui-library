import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BulkUploadServiceService } from "app/modules/net-banking/bulk-upload/bulk-upload-service.service";
import { InternetBankingService } from "app/modules/net-banking/internet-banking.service";
import { BeneficiaryBulkUploadConstant } from "../beneficiary-bulk-upload/benificiary-bulk-upload.constant";
import { BeneficiaryService } from "../beneficiary.service";

@Component({
  selector: "app-benificiary-bulk-upload-summary",
  templateUrl: "./benificiary-bulk-upload-summary.component.html",
  styleUrls: ["./benificiary-bulk-upload-summary.component.scss"],
})
export class BenificiaryBulkUploadSummaryComponent implements OnInit {
  columns: any = BeneficiaryBulkUploadConstant.UPLOAD_SUMMARY;
  sort: any;
  size: number = 5;
  sortOrder: any;
  page: number = 1;
  pageSize: number = 5;
  sortValue = "";
  sortDirection = "";
  filterBy: any;
  module: any;
  bulkUploadData: any;
  staticData: any = {
    data: BeneficiaryBulkUploadConstant.STATIC_SUMMARY,
    meta: {
      page: 1,
      size: 5,
      totalElements: 562,
      totalPages: 113,
    },
    statusCode: 200,
    status: "OK",
  };
  bulkUploadType: any;

  constructor(
    private route: Router,
    private bulkService: InternetBankingService,
    private bulkuploadService: BulkUploadServiceService,
    private activatedRoute: ActivatedRoute,
    private benificiaryService: BeneficiaryService
  ) { }

  ngOnInit(): void { }

  customGoBack() {
    this.route.navigate(["/user/dashboard"]);
  }

  navigateToBulkUpload(id) {
    this.route.navigate(["user/dashboard/trade/bulk-upload", id]);
  }

  bulkUpload() {
    this.navigateToBulkUpload("addNew");
  }
  editRecord(element) {
    this.navigateToBulkUpload(element.element.refNumber);
  }
  getDataByPage(event) {
    this.page = event.page;
    this.pageSize = event.size;
    this.sortDirection = event.direction;
    this.sortValue = event.sort;
    this.filterBy = event.filterBy;
    this.module = event.module;
    this.benificiaryService
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

  customDownloadRecord() {
    this.bulkuploadService
      .downloadBulkuploadParentSummary()
      .subscribe((data) => {
        let blob = new Blob([data], { type: "application/octet-stream" });
        var downloadURL = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = downloadURL;
        link.download = "report.xlsx";
        link.click();
      });
  }
}
