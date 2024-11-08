import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { NETBANKING } from "./net-banking-dashboard.constant";
import { TokenStorageService } from "app/shared/token-storage.service";
import { Account } from "app/shared/models/account-list-by-subclass.model";
import { FlexBalanceModel } from "app/shared/models/flex-balance.model";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
import { SelectSingleTransferComponent } from "app/shared/components/select-single-transfer/select-single-transfer.component";
import { IcHttpResponseModel } from "app/shared/models/ic-http-response.model";
import { PendingApprovalSummary } from "app/shared/models/pending-approval.model";
import { TranslateService } from "@ngx-translate/core";
import { InternetBankingService } from "app/shared/services/internet-banking.service";
import { LoanService } from "app/shared/services/net-loan-service/loan.service";
import { LoanAccounts } from "app/shared/models/loan-account.model";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-net-banking-dashboard",
  templateUrl: "./net-banking-dashboard.component.html",
  styleUrls: ["./net-banking-dashboard.component.scss"],
})
export class NetBankingDashboardComponent implements OnInit, AfterViewInit {
  dashboardInfo: any;
  Object = Object;
  transferType = NETBANKING.transferType;
  dummyHeader = NETBANKING.dummyHeader;
  colorCode = NETBANKING.colorCode;
  navigationItems = NETBANKING.navigationItems;
  dummyResponse: PendingApprovalSummary[];
  selectedKey: string | null = null;
  availableBalance: number[][];
  availableBalanceForAccount: any;
  genericScreenName: any = "Pending for approval";
  currentIndex = 1;
  transferArray = NETBANKING.transferType[0].types;
  loanDetails: LoanAccounts;
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

  @ViewChild("targetElContainer") targetElContainer!: ElementRef;
  @ViewChild("targetElement") targetElement!: ElementRef;
  tableContainerSize: number = window.innerWidth;

  constructor(
    private netBankingService: InternetBankingService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private cdr: ChangeDetectorRef,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private dialog: MatDialog,
    public translate: TranslateService,
    public loanService: LoanService,
    private renderer: Renderer2,
    private sessionStorageService: SessionStorageService
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
    this.getDashboardInfo();
    this.getActivityLogData();
    this.getDataByPage();
    setTimeout(() => {
      let lang = this.tokenStorageService.getLanguage() ?? "en";
      this.translate.use(lang);
    }, 300);
  }

  ngAfterViewInit(): void {
    this.checkTableWidth();
  }

  checkTableWidth() {
    const targetElContainer = this.targetElContainer.nativeElement.offsetWidth;
    const targetElement = this.targetElement.nativeElement.offsetWidth;
    this.tableContainerSize = targetElContainer;

    if (targetElement > targetElContainer) {
      this.renderer.addClass(
        this.targetElContainer.nativeElement,
        "scroll_more_shadow"
      );
    }
  }

  onTableSectionScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const isScrolledToEnd =
      target.scrollWidth - target.scrollLeft === target.clientWidth;

    if (isScrolledToEnd) {
      this.renderer.removeClass(
        this.targetElContainer.nativeElement,
        "scroll_more_shadow"
      );
      this.renderer.addClass(
        this.targetElContainer.nativeElement,
        "scroll_more_left_shadow"
      );
    } else if (target.scrollLeft > 1) {
      this.renderer.addClass(
        this.targetElContainer.nativeElement,
        "scroll_more_left_shadow"
      );
      this.renderer.addClass(
        this.targetElContainer.nativeElement,
        "scroll_more_shadow"
      );
    } else if (target.scrollLeft <= 1) {
      this.renderer.removeClass(
        this.targetElContainer.nativeElement,
        "scroll_more_left_shadow"
      );
      this.renderer.addClass(
        this.targetElContainer.nativeElement,
        "scroll_more_shadow"
      );
    } else {
      this.renderer.addClass(
        this.targetElContainer.nativeElement,
        "scroll_more_shadow"
      );
      this.renderer.addClass(
        this.targetElContainer.nativeElement,
        "scroll_more_left_shadow"
      );
    }
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

  fetchLoanDetails(customerNo: string) {
    this.loanService
      .fetchLoanDetails(customerNo)
      .subscribe((res: IcHttpResponseModel<LoanAccounts>) => {
        if (res?.statusCode == 200 && res?.data) {
          this.loanDetails = res?.data;
          console.log(this.loanDetails, "checkloandetailss");
          // this.sessionStorageService.setLoanInfo(this.loanDetails);
        }
      });
  }

  async fetchAccountList() {
    this.netBankingService
      .fetchAccountDetails(this.currentUser.mobile)
      .subscribe((res: IcHttpResponseModel<any>) => {
        if (res?.statusCode === 200 && res?.data) {
          this.accountlist = res?.data?.accounts;
          const listOfAccounts = [];
          this.accountlist.forEach(async (item: any) => {
            console.log(item);
            if (item?.type == "Accounts") {
              item?.accountList?.forEach((account) => {
                listOfAccounts.push({
                  ...account,
                  accountType: item?.accountType,
                });
              });
            }
          });
          this.getAccountList();

          setTimeout(() => {
            this.selectedAcc = listOfAccounts[0]?.accountNo;
            this.sessionStorageService.setListOfAccounts(listOfAccounts);
            // this.sessionStorageService.setSelectedAccountNo(this.selectedAcc);
          }, 1000);
        }
      });
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
    this.router.navigate([
      "/user/dashboard/fund-transfer/pending-for-approval",
    ]);
  }
  viewPendingRecord(element) {
    console.log(element, "...........");
    this.router.navigate([
      "/user/dashboard/fund-transfer/bulk-upload",
      element?.id,
    ]);
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
          this.router.navigate(["user/dashboard/fund-transfer/credit-card"]);
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
        .subscribe((res: IcHttpResponseModel<FlexBalanceModel>) => {
          if (res?.statusCode === 200 && res?.data) {
            resolve(res?.data?.currbal || 0);
          } else {
            resolve(0);
          }
        });
    });
  }
}
