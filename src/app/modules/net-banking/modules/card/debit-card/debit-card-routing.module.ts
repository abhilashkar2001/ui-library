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
      import("./debit-card-dashboard/debit-card-dashboard.module").then(
        (m) => m.DebitCardDashboardModule
      ),
  },
  {
    path: "service",
    loadChildren: () =>
      import("./debit-card-service/debit-card-service.module").then(
        (m) => m.DebitCardServiceModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebitCardRoutingModule {}
