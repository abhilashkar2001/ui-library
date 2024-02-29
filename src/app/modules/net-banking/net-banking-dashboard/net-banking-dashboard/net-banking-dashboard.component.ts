import { Component, OnInit } from "@angular/core";
import { InternetBankingService } from "../../internet-banking.service";

@Component({
  selector: "app-net-banking-dashboard",
  templateUrl: "./net-banking-dashboard.component.html",
  styleUrls: ["./net-banking-dashboard.component.scss"],
})
export class NetBankingDashboardComponent implements OnInit {
  dashboardInfo: any;
  Object = Object;
  selectedKey: string | null = null;
  availableBalance: number[];
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

  constructor(private netBankingService: InternetBankingService) {}

  ngOnInit(): void {
    this.getDashboardInfo();
  }

  getDashboardInfo() {
    this.netBankingService.getDashboardInfo().subscribe((resp: any) => {
      if (resp?.statusCode == 200) {
        this.dashboardInfo = resp?.data || {};
        this.availableBalance = [];
        Object.keys(this.dashboardInfo).forEach((key) => {
          let balance = 0;
          this.dashboardInfo[key].forEach((el) => {
            balance += parseFloat(el.balance);
          });
          this.availableBalance.push(balance);
        });
      }
    });
  }

  cardDetails(key: string) {
    this.selectedKey = key;
  }
}
