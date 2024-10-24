import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

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
  {
    path: "service",
    loadChildren: () =>
      import("./credit-card-service/credit-card-service.module").then(
        (m) => m.CreditCardServiceModule
      ),
  },
  {
    path: "manage-card",
    loadChildren: () =>
      import("./manage-credit-card/manage-credit-card-module.module").then(
        (m) => m.ManageCreditCardModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditCardRoutingModule {}
