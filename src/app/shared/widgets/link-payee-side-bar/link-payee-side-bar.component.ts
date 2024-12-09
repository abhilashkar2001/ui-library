import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { TransactionCardComponent } from "../transaction-card/transaction-card.component";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { CreditCardStore } from "app/modules/net-banking/modules/card/credit-card/credit-card.store";
import { QrcodeComponent } from "app/shared/components/qrcode/qrcode.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-link-payee-side-bar",
  templateUrl: "./link-payee-side-bar.component.html",
  styleUrls: ["./link-payee-side-bar.component.scss"]
})
export class LinkPayeeSideBarComponent implements OnInit {
  @Input() viewPayee: any;
  @Input() screenname: string = "";
  @Input() externalLinks: any;
  @ViewChild("focusButton") focusButton: ElementRef<HTMLButtonElement> | any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      "extend-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/extend-arrow.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "plus-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/plus-icon.svg"
      )
    );
  }

  ngOnInit(): void {
    if (!this.externalLinks) {
      this.externalLinks = CreditCardStore.externalLinks;
    }
  }

  openQuickLink() {
    this.dialog.open(TransactionCardComponent, {
      disableClose: false,
      width: "80%",
      backdropClass: "background_blur",
      panelClass: "popup-class",
      autoFocus: true,
      position: {
        top: "120px", // Adjust top position
        right: "200px" // Adjust left position
      }
    });
  }

  addFund() {
    this.dialog.open(QrcodeComponent, {
      width: "60%",
      panelClass: "qrcodeClass"
    });
  }

  navigateToAddPayee() {
    this.router.navigate([`/send-money/payee/add-payee/dashboard/domestic`]);
  }
}
