import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FundTransferComponent } from "./fund-transfer/fund-transfer.component";
import { SingleFundTransferComponent } from "./single-fund-transfer/single-fund-transfer.component";
import { MultiFundTransferComponent } from "./multi-fund-transfer/multi-fund-transfer.component";
import { CreditCardPaymentComponent } from "./credit-card-payment/credit-card-payment.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "home",
  },
  { path: "home", component: FundTransferComponent },
  {
    path: "single",
    component: SingleFundTransferComponent,
  },
  {
    path: "multi",
    component: MultiFundTransferComponent,
  },
  {
    path: "credit-card",
    component: CreditCardPaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FundTransferRoutingModule {}
