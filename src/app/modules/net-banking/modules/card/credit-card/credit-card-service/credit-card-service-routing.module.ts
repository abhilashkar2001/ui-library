import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ConvertToEmiComponent } from "./components/convert-to-emi/convert-to-emi.component";
import { PaymentComponent } from "./components/payment/payment.component";
import { CreditCardServiceComponent } from "./credit-card-service/credit-card-service.component";
import { PaymentPageComponent } from "../../../dashboard/modules/cheque-book/payment-page/payment-page.component";

const routes: Routes = [
  {
    path: "",
    component: CreditCardServiceComponent,
    children: [
      {
        path: "",
        redirectTo: "payment",
        pathMatch: "full",
      },
      {
        path: "convert-to-emi",
        component: ConvertToEmiComponent,
      },
      {
        path: "payment",
        component: PaymentComponent,
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
