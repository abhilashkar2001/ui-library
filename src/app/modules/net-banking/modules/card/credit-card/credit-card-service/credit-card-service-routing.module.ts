import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ConvertToEmiComponent } from "./components/convert-to-emi/convert-to-emi.component";
import { PaymentComponent } from "./components/payment/payment.component";
import { CreditCardServiceComponent } from "./credit-card-service/credit-card-service.component";
import { PaymentPageComponent } from "../../../dashboard/modules/cheque-book/payment-page/payment-page.component";
import { AddOnCardComponent } from "./components/add-on-card/add-on-card.component";
import { AlertSubscriptionComponent } from "./components/alert-subscription/alert-subscription.component";
import { BillingCycleComponent } from "./components/billing-cycle/billing-cycle.component";
import { BlockCardComponent } from "./components/block-card/block-card.component";
import { CardEmiDetailsComponent } from "./components/card-emi-details/card-emi-details.component";
import { ChangePinComponent } from "./components/change-pin/change-pin.component";
import { EStatementComponent } from "./components/e-statement/e-statement.component";
import { InstantLoanComponent } from "./components/instant-loan/instant-loan.component";
import { PinGenerationComponent } from "./components/pin-generation/pin-generation.component";
import { PreGeneratedStatementComponent } from "./components/pre-generated-statement/pre-generated-statement.component";
import { UnbilledTransactionComponent } from "./components/unbilled-transaction/unbilled-transaction.component";
import { UpgradeComponent } from "./components/upgrade/upgrade.component";
import { AutoPayComponent } from "./components/auto-pay/auto-pay.component";

const routes: Routes = [
  {
    path: "",
    component: CreditCardServiceComponent,
    children: [
      {
        path: "",
        redirectTo: "convert-to-emi",
        pathMatch: "full",
      },
      {
        path: "add-on-card",
        component: AddOnCardComponent,
      },
      {
        path: "alert-subscription",
        component: AlertSubscriptionComponent,
      },
      {
        path: "autopay",
        component: AutoPayComponent,
      },
      {
        path: "billing-cycle",
        component: BillingCycleComponent,
      },
      {
        path: "block-card",
        component: BlockCardComponent,
      },
      {
        path: "card-emi-details",
        component: CardEmiDetailsComponent,
      },
      {
        path: "change-pin",
        component: ChangePinComponent,
      },
      {
        path: "convert-to-emi",
        component: ConvertToEmiComponent,
      },
      {
        path: "instant-loan",
        component: InstantLoanComponent,
      },
      {
        path: "payment",
        component: PaymentComponent,
      },
      {
        path: "pin-generation",
        component: PinGenerationComponent,
      },
      {
        path: "pre-generated-statement",
        component: PreGeneratedStatementComponent,
      },
      {
        path: "unbilled-transaction",
        component: UnbilledTransactionComponent,
      },
      {
        path: "upgrade",
        component: UpgradeComponent,
      },
      {
        path: "e-statement",
        component: EStatementComponent,
      },
    ],
  },
  {
    path: "payment-summary",
    component: PaymentPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditCardServiceRoutingModule {}
