import { Component, OnInit } from "@angular/core";
import { BulkUploadConstant } from "./add-bulk-upload/bulk.upload.constant";

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

  constructor() {}

  ngOnInit(): void {}
}
