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
