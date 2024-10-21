import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TradeDashboardComponent } from "./trade-dashboard/trade-dashboard.component";
import { TradeFlowComponent } from "./trade-flow/trade-flow.component";
const routes: Routes = [
  {
    path: "",
    component: TradeFlowComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        component: TradeDashboardComponent,
      },
      {
        path: "beneficiary",
        loadChildren: () =>
          import(
            "./modules/benificiary-maintenance/benificiary-maintenance.module"
          ).then((m) => m.BenificiaryMaintenanceModule),
      },
      {
        path: "bank-gurantee",
        loadChildren: () =>
          import("./modules/bank-guarantee/bank-guarantee.module").then(
            (m) => m.BankGuaranteeModule
          ),
      },
      {
        path: "letter-of-credit",
        loadChildren: () =>
          import("./modules/letter-of-credit/letter-of-credit.module").then(
            (m) => m.LetterOfCreditModule
          ),
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradeRoutingModule {}
