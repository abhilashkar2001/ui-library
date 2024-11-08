import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { CreditCardStore } from "../../../credit-card.store";
import { CardService } from "../../../../card.service";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { EmiDetails } from "app/shared/models/emi-converter.model";
import { IcHttpResponseModel } from "app/shared/models/ic-http-response.model";
import { NewErrorPopupComponent } from "app/modules/home/new-error-popup/new-error-popup.component";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";

@Component({
  selector: "app-card-emi-details",
  templateUrl: "./card-emi-details.component.html",
  styleUrls: ["./card-emi-details.component.scss"],
})
export class CardEmiDetailsComponent implements OnInit {
  cardEmiDetailsForm: FormGroup;
  creditEmiHeader = CreditCardStore.creditEmiHeader;
  creditEmiValues: EmiDetails[] = [];
  customerId: string;
  listOfAccounts: string[] = [];
  creditCardNo: any;

  constructor(
    private fb: FormBuilder,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private sessionStorageService: SessionStorageService,
    private cardService: CardService,
    private dialog: MatDialog
  ) {
    this.registerIcons();
  }

  ngOnInit(): void {
    this.initializeCustomerId();
    this.buildCardEmiDetailsForm();
    this.fetchListOfCards(this.customerId);
  }

  private registerIcons(): void {
    this.matIconRegistry.addSvgIcon(
      "download-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/svg/download-white.svg"
      )
    );
  }

  private initializeCustomerId(): void {
    this.customerId =
      this.sessionStorageService.getCustomerInfo()?.customerId || null;
  }

  private buildCardEmiDetailsForm(): void {
    this.cardEmiDetailsForm = this.fb.group({
      creditNumber: [""],
    });
  }

  private fetchListOfCards(customerId): void {
    this.listOfAccounts = this.sessionStorageService?.getListOfCards();
  }

  handleTransactionDetails(cardNumber: string): void {
    if (cardNumber) {
      this.fetchTransactionDetails(cardNumber);
    }
  }

  private fetchTransactionDetails(cardNumber: string): void {
    this.cardService
      .fetchEmiDetails(cardNumber, this.customerId)
      .subscribe((response: IcHttpResponseModel<EmiDetails[]>) => {
        if (response && response?.statusCode === 200) {
          this.creditEmiValues = response.data;
        }
      });
  }
  downLoad() {
    if (this.cardEmiDetailsForm.valid) {
      let month: number = this.cardEmiDetailsForm.get("month").value;
      let year: number = this.cardEmiDetailsForm.get("year").value;
      this.cardService
        .downloadCreditInfoAsPdf(this.creditCardNo, month, year)
        .subscribe(
          (res: Blob) => {
            this.downloadFile(res);
          },
          (errorResponse) => {
            this.errorPopUp(errorResponse);
          }
        );
    }
  }
  downloadFile(blobData: Blob): void {
    const blob = new Blob([blobData], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "credit_info.pdf";
    link.click();
    window.URL.revokeObjectURL(url);
  }
  errorPopUp(res) {
    let errPayload = {
      error: res?.error,
      message: res?.message,
      statusCode: res?.status,
    };
    this.dialog.open(NewErrorPopupComponent, {
      width: "45%",
      height: "50%",
      disableClose: true,
      data: {
        type: "customError",
        errPayload,
      },
    });
  }
}
