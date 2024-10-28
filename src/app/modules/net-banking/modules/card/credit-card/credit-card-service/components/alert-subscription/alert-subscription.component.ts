import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

import { MatDialog } from "@angular/material/dialog";
import { CreditCardStore } from "../../../credit-card.store";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { CardService } from "../../../../card.service";
import { PopupSuccessComponent } from "app/shared/components/popup-success/popup-success.component";

@Component({
  selector: "app-alert-subscription",
  templateUrl: "./alert-subscription.component.html",
  styleUrls: ["./alert-subscription.component.scss"],
})
export class AlertSubscriptionComponent implements OnInit {
  alertSubscriptionForm: FormGroup;
  cardList: any = [];
  accountDetails: any;
  typeofCard: any;
  alertData = CreditCardStore.alertData;

  constructor(
    private formbuilder: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private cardService: CardService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cardList = this.sessionStorageService.getListOfCards();
    this.buildAlertSubscription();
  }
  patchDetails(event: any) {
    const account = event;
    this.accountDetails = this.cardList?.find(
      (card) => card?.cardNumber == account
    );
    if (this.accountDetails) {
      this.typeofCard = this.accountDetails?.typeOfCard;
      this.alertSubscriptionForm
        ?.get("cardNo")
        .patchValue(this.accountDetails?.cardNumber);
    }
  }
  buildAlertSubscription() {
    this.alertSubscriptionForm = this.formbuilder.group({
      cardNo: [""],
    });
  }
  proceed() {
    if (!this.alertSubscriptionForm?.valid) return;
    let payload = { ...this.alertSubscriptionForm.value };
    this.cardService.fetchAlertByCardNo(payload?.cardNo).subscribe((res) => {
      console.log(res);
      if (res?.statusCode === 200) {
        this.openDialog(PopupSuccessComponent, {
          data: {
            auth: {
              type: "Success",
              status: "Alert Subscription!",
              msg: "Any update you’ll received notification",
            },
          },
          disableClose: true,
          panelClass: "popup-dialog-class",
          backdropClass: "bdrop",
        }).subscribe();
      }
    });
  }
  // Common method for opening dialogs
  private openDialog(component: any, config: any) {
    return this.dialog.open(component, config).afterClosed();
  }
}
