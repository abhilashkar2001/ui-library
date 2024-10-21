import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NetBankingDashboardComponent } from "./net-banking-dashboard/net-banking-dashboard.component";

const routes: Routes = [
  {
    path: "",
    component: NetBankingDashboardComponent,
  },
  {
    path: "fund-transfer",
    loadChildren: () =>
      import("./modules/fund-transfer/fund-transfer.module").then(
        (m) => m.FundTransferModule
      ),
  },
  {
    path: "cheque",
    loadChildren: () =>
      import("./modules/cheque-book/cheque-book.module").then(
        (m) => m.ChequeBookModule
      ),
  },
  {
    path: "salary-account",
    loadChildren: () =>
      import("./modules/salary-account/salary-account.module").then(
        (m) => m.SalaryAccountModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
