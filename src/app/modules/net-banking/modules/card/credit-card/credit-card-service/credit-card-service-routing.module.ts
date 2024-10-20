import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreditCardServiceComponent } from "./credit-card-service/credit-card-service.component";
import { ConvertToEmiComponent } from "./components/convert-to-emi/convert-to-emi.component";
import { PaymentComponent } from "./components/payment/payment.component";

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditCardServiceRoutingModule {}
