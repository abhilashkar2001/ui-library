import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { CreditCardStore } from "../../../credit-card.store";
import { CardService } from "../../../../card.service";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { EmiDetails } from "app/shared/models/emi-converter.model";
import { IcHttpResponseModel } from "app/shared/models/ic-http-response.model";

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

  constructor(
    private fb: FormBuilder,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private sessionStorageService: SessionStorageService,
    private cardService: CardService
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
    if (customerId) {
      this.cardService.fetchListOfCards(customerId).subscribe((resp) => {
        if (resp && resp.statusCode === 200) {
          this.listOfAccounts = resp.data;
        }
      });
    }
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
}
