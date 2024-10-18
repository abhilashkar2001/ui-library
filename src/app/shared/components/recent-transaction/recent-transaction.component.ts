import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { CreatedDurationModelComponent } from "../created-duration-model/created-duration-model.component";
import { CardService } from "app/modules/net-banking/modules/card/card.service";

@Component({
  selector: "app-recent-transaction",
  templateUrl: "./recent-transaction.component.html",
  styleUrls: ["./recent-transaction.component.scss"],
})
export class RecentTransactionComponent implements OnInit {
  @Output() tabChanged = new EventEmitter<any>();
  @Input("customerInfo") customerInfo;
  @Input("selectedAcc") selectedAcc;

  @Input("showMoneyStatusIcon") showMoneyStatusIcon;
  @Input("recentTransTabs")
  recentTransTabs;
  @Input("recentTransCols") recentTransCols;
  @Input("recentTransData") recentTransData;
  selectedRecentTab: any;
  searchValue: FormControl = new FormControl("");
  selectedDate: FormControl = new FormControl("");

  actionDateOptions = [
    { value: "ONEDAY", label: "Today" },
    { value: "ONEWEEK", label: "Last 7 days" },
    { value: "CURRENTMONTH", label: "Current Month" },
    { value: "LASTTHREEMONTH", label: "Last 3 Month" },
    { value: "DATERANGE", label: "Select Date Range" },
  ];

  fromDate: string;
  toDate: string;
  createdDate: string;
  constructor(
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private sessionStorageService: SessionStorageService,
    private cardService: CardService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.matIconRegistry.addSvgIcon(
      "search-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/search-icon.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "filter-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/filter-icon.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "extend-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/extend-arrow.svg"
      )
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.recentTransData) {
      if (changes.recentTransData.currentValue) {
        this.recentTransData = changes.recentTransData.currentValue;
      }
    }
    if (changes.customerInfo) {
      if (changes.customerInfo.currentValue) {
        this.customerInfo = changes.customerInfo.currentValue;
      }
    }
    if (changes.selectedAcc) {
      if (changes.selectedAcc.currentValue) {
        this.selectedAcc = changes.selectedAcc.currentValue;
      }
    }
  }

  ngOnInit(): void {
    if (this.recentTransTabs?.length > 0)
      this.selectedRecentTab = this.recentTransTabs[0];
    this.fetRecntTransaction();
  }

  changeRecentTransTabs(i) {
    this.selectedRecentTab = this.recentTransTabs[i];
    this.tabChanged.emit(this.selectedRecentTab);
    this.recentTransTabChange(this.selectedRecentTab);
  }
  filterSearchValue() {
    this.recentTransTabChange(this.selectedRecentTab);
  }
  recentTransTabChange(event) {
    //For now only "Account" tab is working.Once Other tabs functionality will come then for rest tab will call api
    if (event == "Account") this.fetRecntTransaction();
    else if (event == "MMID") this.fetRecntTransactionScreenWise("MMID");
    else if (event == "Abroad")
      this.fetRecntTransactionScreenWise("Send Money Abroad");
    else this.recentTransData = [];
  }

  createpayload() {
    let payload: any;
    if (this.selectedDate.value == "DATERANGE") {
      payload = {
        searchValue: this.searchValue.value,
        fromDate: this.fromDate,
        toDate: this.toDate,
      };
    } else {
      payload = {
        searchValue: this.searchValue.value,
        createdDate: this.selectedDate.value,
      };
    }
    return payload;
  }
  fetRecntTransaction() {
    let customer = this.sessionStorageService.getCustomerInfo();
    this.recentTransData = [];
    console.log(this.createpayload());
    this.cardService
      .fetchAllRecentTransaction(customer.customerId, this.createpayload())
      .subscribe((resp: any) => {
        if (resp?.statusCode == 200) {
          this.recentTransData = resp?.data;
          this.recentTransData.forEach((element) => {
            element.action = "Repay";
            const date = new Date(element.created);
            const formattedDate = date.toISOString().split("T")[0];
            element.created = formattedDate;
          });
        }
      });
  }

  fetRecntTransactionScreenWise(screen) {
    let customer = this.sessionStorageService.getCustomerInfo();
    this.recentTransData = [];
    console.log(this.createpayload());

    this.cardService
      .fetchScreenWiseRecentTrans(
        screen,
        customer.customerId,
        this.createpayload()
      )
      .subscribe((resp: any) => {
        if (resp?.statusCode == 200) {
          this.recentTransData = resp?.data;
          this.recentTransData.forEach((element) => {
            // if (element.creditAmount != null) {
            //   if (selectedAcc == element?.debitAccount)

            //     element.creditAmount = -element?.creditAmount;
            //   else element.creditAmount = +element?.creditAmount;
            // }
            element.action = "Repay";
            const date = new Date(element.created);
            const formattedDate = date.toISOString().split("T")[0];
            element.created = formattedDate;
          });
        }
      });
  }

  checkValue(event: any) {
    if (event === "DATERANGE") this.openDuration();
    this.recentTransTabChange(this.selectedRecentTab);
  }

  openDuration() {
    const dialogRef = this.dialog.open(CreatedDurationModelComponent, {
      width: "40%",
      maxWidth: "max-content",
      disableClose: true,
      panelClass: "popup-class-approve",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fromDate = result[0];
        this.toDate = result[1];
        this.recentTransTabChange(this.selectedRecentTab);
      }
    });
  }

  gotoBillTransaction() {
    this.router.navigate(["/card/credit-card/service/unbilled-transaction"]);
  }
}
