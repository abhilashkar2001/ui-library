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
      import("./prepaid-card-dashboard/prepaid-card-dashboard.module").then(
        (m) => m.PrepaidCardDashboardModule
      ),
  },
  {
    path: "service",
    loadChildren: () =>
      import("./prepaid-card-services/prepaid-card-services.module").then(
        (m) => m.PrepaidCardServicesModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrepaidCardRoutingModule {}
