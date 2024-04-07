import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-trade-dashboard",
  templateUrl: "./trade-dashboard.component.html",
  styleUrls: ["./trade-dashboard.component.scss"],
})
export class TradeDashboardComponent implements OnInit {
  tradeHeader: any[] = [
    { name: "Type of Request", value: "typeOfRequest" },
    { name: "Initiators", value: "indicators" },
    { name: "Authorizer", value: "authorizer" },
    { name: "Bank", value: "bank" },
  ];

  transactionGridData = [
    {
      transactionName: "Bank Guarantee",
      childItems: [
        {
          typeOfRequest: "BG issuance",
          indicators: 3,
          authorizer: 0,
          bank: 0,
        },
        {
          typeOfRequest: "BG Amendment",
          indicators: 3,
          authorizer: 0,
          bank: 0,
        },
        {
          typeOfRequest: "BG Physical Amendment",
          indicators: 3,
          authorizer: 0,
          bank: 0,
        },
      ],
    },
    {
      transactionName: "BaBGnk Guarantee",
      childItems: [
        {
          typeOfRequest: "BG issuance",
          indicators: 3,
          authorizer: 0,
          bank: 0,
        },
        {
          typeOfRequest: "BG Amendment",
          indicators: 3,
          authorizer: 0,
          bank: 0,
        },
        {
          typeOfRequest: "BG Physical Amendment",
          indicators: 3,
          authorizer: 0,
          bank: 0,
        },
      ],
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
