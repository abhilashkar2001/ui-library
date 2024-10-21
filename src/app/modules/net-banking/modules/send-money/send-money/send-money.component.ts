import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { SendMoneyStore } from "../send-money-store";
import { ActivatedRoute, Router } from "@angular/router";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
// import { DashboardService } from "app/@core/services/dashboard.service";
import { SessionStorageService } from "app/shared/services/session-storage.service";

@Component({
  selector: "app-send-money",
  templateUrl: "./send-money.component.html",
  styleUrls: ["./send-money.component.scss"],
})
export class SendMoneyComponent implements OnInit {
  @Input("sendMoneyComponentsChange")
  tabScreens = SendMoneyStore.tabScreens.slice(0, 6);
  recentTransTabs = SendMoneyStore.recentTabs;
  recentTransCols = SendMoneyStore.recentColumns;
  recentTransData: any;
  selected = this.tabScreens[0].screenName;
  externalLinks = SendMoneyStore.externalLinks;
  startTabIndex = 0;
  isRotated: boolean;
  sendMoneyComponents: boolean = true;
  selectedAccount: any;
  customerInfo: any;
  showMoneyStatusIcon: boolean = true;
  recentTransKey = [
    "Transfer Money",
    "Self Transfer",
    "Quick transfer",
    "MMID",
    "Schedule Payment",
    "Send Money Abroad",
  ];
  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    // private dashboardService: DashboardService,
    private sessionStorageService: SessionStorageService
  ) {
    // const navigation = this.route.getCurrentNavigation();

    if (route.url) {
      this.selected = this.tabScreens.find(
        (i) => i?.route === route.url
      )?.screenName;
    }

    this.activatedRoute.queryParamMap.subscribe((param) => {
      const screenName = param.get("screenName");
      if (screenName) {
        this.selected = screenName;
      }
    });

    // if (navigation?.extras?.state) {
    //   this.selected = navigation?.extras?.state?.screenName;
    // }

    this.tabScreens.forEach((tab) => {
      this.matIconRegistry.addSvgIcon(
        tab.icon,
        this.sanitizer.bypassSecurityTrustResourceUrl(tab.src)
      );
      this.matIconRegistry.addSvgIcon(
        tab.selectedIcon,
        this.sanitizer.bypassSecurityTrustResourceUrl(tab.selectedSrc)
      );
      this.matIconRegistry.addSvgIcon(
        "arrow-back",
        this.sanitizer.bypassSecurityTrustResourceUrl(
          "assets/images/svg/arrow-back.svg"
        )
      );
    });
  }

  ngOnInit(): void {
    this.customerInfo = this.sessionStorageService.getCustomerInfo();
    // this.selectedAccount = this.sessionStorageService.getSelectedAccountNo();
    this.fetRecntTransaction(
      this.recentTransKey[
        this.tabScreens.findIndex((item) => item?.screenName == this.selected)
      ]
    );
  }

  changeTabs(index) {
    this.selected = this.tabScreens[index].screenName;
    this.route.navigate([this.tabScreens[index].route]);
    this.fetRecntTransaction(this.recentTransKey[index]);
  }

  recentTransTabChange(event) {
    //For now only "Account" tab is working.Once Other tabs functionality will come then for rest tab will call api
    if (event == "Account")
      this.fetRecntTransaction(
        this.recentTransKey[
          this.tabScreens.findIndex((item) => item?.screenName == this.selected)
        ]
      );
    else this.recentTransData = [];
  }

  slide() {
    if (this.startTabIndex + 6 < SendMoneyStore.tabScreens.length) {
      this.startTabIndex += 6;
      this.isRotated = true;
    } else {
      this.startTabIndex = 0;
      this.isRotated = false;
    }
    this.updateVisibleTabs();
  }

  updateVisibleTabs() {
    this.tabScreens = SendMoneyStore.tabScreens.slice(
      this.startTabIndex,
      this.startTabIndex + 6
    );
    this.cdr.detectChanges();
  }

  get visibleTabScreens() {
    return this.tabScreens;
  }

  fetRecntTransaction(screenName) {
    let customer = this.sessionStorageService.getCustomerInfo();
    this.recentTransData = [];
    // this.dashboardService
    //   .fetchScreenWiseRecentTrans(screenName, customer.customerId)
    //   .subscribe((resp: any) => {
    //     if (resp?.statusCode == 200) {
    //       this.recentTransData = resp?.data;
    //       this.recentTransData.forEach((element) => {
    //         // if (element.creditAmount != null) {
    //         //   if (accNo == element?.debitAccount)
    //         //     element.creditAmount = -element?.creditAmount;
    //         //   else element.creditAmount = +element?.creditAmount;
    //         // }
    //         element.action = "Repay";
    //         const date = new Date(element.created);
    //         const formattedDate = date.toISOString().split("T")[0];
    //         element.created = formattedDate;
    //       });
    //     }
    //   });
  }
}
