import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { InternetBankingService } from "../../internet-banking.service";
import { Router } from "@angular/router";
import { NETBANKING } from "./net-banking-dashboard.constant";
import { TokenStorageService } from "app/shared/token-storage.service";
import { Account } from "app/shared/models/account-list-by-subclass.model";
import { FlexBalanceModel } from "app/shared/models/flex-balance.model";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
import { MatDialog } from "@angular/material/dialog";
import { SelectSingleTransferComponent } from "app/shared/components/select-single-transfer/select-single-transfer.component";

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
  availableBalance: number[][];
  availableBalanceForAccount: any;
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
  currentUser: any;
  accountlist: { accountType: string; accountList: Account[] }[];
  accountNumberList: any = [];
  customerInfo: any;
  selectedAcc: any;
  accountsInfo: any;
  corporateId: any;

  constructor(
    private netBankingService: InternetBankingService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private cdr: ChangeDetectorRef,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {
    this.currentUser = tokenStorageService.getUser();
    this.matIconRegistry.addSvgIcon(
      `search-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/search_icon.svg"
      )
    );
  }

  ngOnInit(): void {
    this.corporateId = JSON.parse(sessionStorage.getItem("corporateId"));
    this.getActivityLogData();
    this.getDataByPage();
    this.getDashboardInfo();
  }

  getAccountList() {
    this.accountlist.forEach((item) => {
      if (item?.accountList)
        this.accountNumberList = [
          ...this.accountNumberList,
          ...item.accountList,
        ];
    });
    this.cdr.detectChanges();
  }

  /**
   * dashboard api to show the cards with the balance ant type
   * */
  async getDashboardInfo() {
    this.netBankingService
      .getDashboardInfo(this.corporateId)
      .subscribe((resp: any) => {
        if (resp?.statusCode == 200) {
          this.dashboardInfo = resp?.data?.accounts || {};
          this.availableBalance = [];
          let keywiseBalance = [];
          Object.keys(this.dashboardInfo).forEach((key) => {
            let balance;
            this.dashboardInfo[key]?.accountList.forEach(async (el) => {
              balance = await this.fetchQueryBalance(el?.accountNo);
              keywiseBalance.push(balance);
            });
            this.availableBalance.push(keywiseBalance);
          });
          sessionStorage.setItem("customer-Info", JSON.stringify(resp?.data));
          this.selectedAcc = sessionStorage.getItem("selectAccNo")
            ? sessionStorage.getItem("selectAccNo")
            : resp?.data.accounts?.[0]?.accountList?.[0]?.accountNo;

          const accountList = [];
          resp?.data?.accounts?.forEach((item) => {
            item.accountList?.forEach((element) => {
              accountList.push(element);
            });
          });
          if (accountList)
            sessionStorage.setItem(
              "listOfAccounts",
              JSON.stringify(accountList)
            );
        }
      });
  }
  getDataByPage() {
    this.netBankingService
      .getSummary(
        null,
        null,
        1,
        3,
        null,
        null,
        "coprateNetBanking",
        "CREATED",
        this.corporateId
      )
      .getSummary(
        null,
        null,
        1,
        3,
        null,
        null,
        "coprateNetBanking",
        "CREATED",
        this.corporateId
      )
      .subscribe((res: any) => {
        this.dummyResponse = res?.data
          ?.filter(
            (resp: any) => resp?.lastUpdatedBy != this.currentUser?.userName
          )
          ?.slice(0, 3);
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
    this.router.navigate(["/user/dashboard/bulk-upload", element?.id]);
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
    if (transfer.label == "Single Transfer") {
      const dialogRef = this.dialog.open(SelectSingleTransferComponent, {
        width: "50%",
        panelClass: "popup-class",
      });
      dialogRef.afterClosed().subscribe((res) => {
        console.log(res);

        if (res == "Cancel") return;
        if (res === true) {
          this.router.navigate([transfer.route]);
          if (transfer.type) {
            sessionStorage.setItem("uploadType", transfer.type);
          }
        } else {
          this.router.navigate(["user/net-banking/fund-transfer/credit-card"]);
        }
      });
      return;
    } else if (transfer.label == "Multi Transfer") {
      if ((transfer.type = "MULTI")) {
        this.router.navigate([transfer.route]);
        sessionStorage.setItem("uploadType", transfer.type);
      }
    }
    this.router.navigate([transfer.route]);
  }

  fetchQueryBalance(accountNo) {
    return new Promise((resolve) => {
      this.netBankingService
        .fetchAccountBalance(accountNo)
        .subscribe((res: FlexBalanceModel) => {
          if (res?.statusCode === 200 && res?.data) {
            resolve(res?.data?.currbal || 0);
          } else {
            resolve(0);
          }
        });
    });
  }
}
