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
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardRoutingModule {}
