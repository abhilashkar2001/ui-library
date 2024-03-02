import { Component, OnInit } from "@angular/core";
import { BulkUploadConstant } from "./add-bulk-upload/bulk.upload.constant";
import { Router } from "@angular/router";

@Component({
  selector: "app-bulk-upload",
  templateUrl: "./bulk-upload.component.html",
  styleUrls: ["./bulk-upload.component.scss"],
})
export class BulkUploadComponent implements OnInit {
  columns: any = BulkUploadConstant.UPLOAD_SUMMARY;
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

  constructor(private route: Router) {}

  ngOnInit(): void {}

  customGoBack() {
    this.route.navigate(["/user/dashboard"]);
  }

  navigateToBulkUpload(id) {
    this.route.navigate(["user/dashboard/bulk-upload", id]);
  }

  bulkUpload() {
    this.navigateToBulkUpload("addNew");
  }
  editRecord(element) {
    // update id correctly once api works,
    this.navigateToBulkUpload(element.element.refNumber);
  }
}
