import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-net-banking-home",
  templateUrl: "./net-banking-home.component.html",
  styleUrls: ["./net-banking-home.component.scss"],
})
export class NetBankingHomeComponent implements OnInit {
  genericScreenName: any = "Pending for approval";
  columns = [
    {
      columnDef: "version",
      header: "Version",
      cell: (element: any) => `${element?.version}`,
    },
    {
      columnDef: "lastUpdatedBy",
      header: "Action By",
      cell: (element: any) => `${element.lastUpdatedBy}`,
    },
  ];
  navigationItems = [
    {
      label: "Home",
      icon: "/assets/images/net-banking-nav-bar/Home_Icon.svg",
      link: "/home",
    },
    {
      label: "Fund Transfer",
      icon: "/assets/images/net-banking-nav-bar/Fund-Transfer_Icon.svg",
      link: "/fund-transfer",
    },
    {
      label: "Deposit",
      icon: "/assets/images/net-banking-nav-bar/Deposit_Icon.svg",
      link: "/deposit",
    },
    {
      label: "Cards",
      icon: "/assets/images/net-banking-nav-bar/Cards_Icon.svg",
      link: "/cards",
    },
    {
      label: "Loan",
      icon: "/assets/images/net-banking-nav-bar/Loan_Icon.svg",
      link: "/loan",
    },
    {
      label: "Summary",
      icon: "/assets/images/net-banking-nav-bar/Summary_Icon.svg",
      link: "/summary",
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
