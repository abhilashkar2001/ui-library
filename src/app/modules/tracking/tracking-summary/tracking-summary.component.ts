import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-tracking-summary",
  templateUrl: "./tracking-summary.component.html",
  styleUrls: ["./tracking-summary.component.scss"],
})
export class TrackingSummaryComponent implements OnInit {
  productList = [
    {
      imageUrl: "assets/images/account-img1.png",
      type: "Home Loan",
      applicantNo: "4367374",
      amount: "436734",
      status: "Pending",
    },
    {
      imageUrl: "assets/images/account-img2.png",
      type: "Credit Card",
      applicantNo: "7854626",
      amount: "4883",
      status: "Ongoing",
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
