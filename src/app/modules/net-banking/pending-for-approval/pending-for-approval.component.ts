import { Component, OnInit } from "@angular/core";
import { PendingForApprovalConstant } from "./pending-for-approval.constant";
import { Router } from "@angular/router";

@Component({
  selector: "app-pending-for-approval",
  templateUrl: "./pending-for-approval.component.html",
  styleUrls: ["./pending-for-approval.component.scss"],
})
export class PendingForApprovalComponent implements OnInit {
  columns: any = PendingForApprovalConstant.UPLOAD_SUMMARY;
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

  constructor(private route: Router) {}

  ngOnInit(): void {}

  CustomGoBack(data) {
    this.route.navigate(["/user/dashboard/home"]);
  }
}
