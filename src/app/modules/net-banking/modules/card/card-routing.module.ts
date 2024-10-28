import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "credit-card",
    pathMatch: "full",
  },
  {
    path: "credit-card",
    loadChildren: () =>
      import("./credit-card/credit-card-routing.module").then(
        (m) => m.CreditCardRoutingModule
      ),
  },
  {
    path: "debit-card",
    loadChildren: () =>
      import("./debit-card/debit-card-routing.module").then(
        (m) => m.DebitCardRoutingModule
      ),
  },
  {
    path: "prepaid-card",
    loadChildren: () =>
      import("./prepaid-card/prepaid-card.module").then(
        (m) => m.PrepaidCardModule
      ),
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardRoutingModule {}
