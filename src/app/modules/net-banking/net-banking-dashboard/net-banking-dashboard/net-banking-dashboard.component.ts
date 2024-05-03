import { Component, OnInit } from "@angular/core";
import { InternetBankingService } from "../../internet-banking.service";
import { Router } from "@angular/router";
import { NETBANKING } from "./net-banking-dashboard.constant";

@Component({
  selector: "app-net-banking-dashboard",
  templateUrl: "./net-banking-dashboard.component.html",
  styleUrls: ["./net-banking-dashboard.component.scss"],
})
export class NetBankingDashboardComponent implements OnInit {
  dashboardInfo: any;
  Object = Object;
  transferType = NETBANKING.transferType;
  dummyHeader = NETBANKING.dummyHeader;
  colorCode = NETBANKING.colorCode;
  navigationItems = NETBANKING.navigationItems;
  dummyResponse = NETBANKING.dummyResponse;
  selectedKey: string | null = null;
  availableBalance: number[];
  genericScreenName: any = "Pending for approval";
  currentIndex = 1;
  transferArray = NETBANKING.transferType[0].types;
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

  activityLogData: any;
  displayActivityLog: any[];
  selectedActivityLog: string = "financial";

  constructor(
    private netBankingService: InternetBankingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getDashboardInfo();
    this.getActivityLogData();
    this.getDataByPage();
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
  getDataByPage() {
    this.netBankingService
      .getSummary(null, null, 1, 3, null, null, "coprateNetBanking")
      .subscribe((res: any) => {
        this.dummyResponse = res?.data.slice(0, 3);
      });
  }

  cardDetails(key: string) {
    this.selectedKey = key;
  }
  openPendingForApprovalSummary() {
    this.router.navigate(["/user/dashboard/pending-for-approval"]);
  }
  viewPendingRecord(element) {
    console.log(element, "...........");
    this.router.navigate(["/user/dashboard/bulk-upload", element.id]);
  }
  getActiveTransferType(transfer) {
    this.currentIndex = transfer.sequence;
    this.transferArray = transfer.types;
  }
  onDropdownChange(event) {
    this.displayActivityLog = [];
    if (event === "financial") {
      this.displayActivityLog = this.activityLogData.financial;
      this.displayActivityLog.forEach((element) => {
        element.total = element.pending + element.processed + element.rejected;
      });
    } else {
      this.displayActivityLog = this.activityLogData.nonfinancial;
      this.displayActivityLog.forEach((element) => {
        element.total = element.pending + element.processed + element.rejected;
      });
    }
  }

  transformLabel(label: string): string {
    if (/[A-Z]/.test(label)) {
      return label
        .replace(/[A-Z]/g, (match, offset) => (offset === 0 ? "" : " ") + match)
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } else {
      return label.charAt(0).toUpperCase() + label.slice(1);
    }
  }
  getActivityLogData() {
    this.netBankingService.getActivityLogData().subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.activityLogData = res?.data;
        this.displayActivityLog = this.activityLogData.financial;
        this.displayActivityLog.forEach((element) => {
          element.total =
            element.pending + element.processed + element.rejected;
        });
      }
    });
  }

  openTransfer(transfer) {
    if (!transfer.route) return;
    this.router.navigate([transfer.route]);
  }
}
