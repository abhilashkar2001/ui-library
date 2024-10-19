import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreditCardDashboardComponent } from "./credit-card-dashboard/credit-card-dashboard.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./credit-card-dashboard/credit-card-dashboard.module").then(
        (m) => m.CreditCardDashboardModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditCardRoutingModule {}
