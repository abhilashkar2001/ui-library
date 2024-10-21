import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanDashboardComponent } from './loan-dashboard/loan-dashboard.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full"
  },
  {
    path: "dashboard",
    component: LoanDashboardComponent,
  },

  {
    path: "loan-service",
    loadChildren: () =>
      import("./loan-services/loan-services.module").then(
        (m) => m.LoanServicesModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanRoutingModule { }
