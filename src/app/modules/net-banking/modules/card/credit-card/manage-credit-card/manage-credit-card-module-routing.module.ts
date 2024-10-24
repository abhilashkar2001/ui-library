import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageCreditCardComponent } from './manage-credit-card.component';
import { RouterModule, Routes } from '@angular/router';
import { CreditCardControlComponent } from './component/credit-card-control/credit-card-control.component';
import { IncreaseLimitComponent } from './component/credit-card-control/pages/increase-limit/increase-limit.component';
import { DesireLimitComponent } from './component/credit-card-control/pages/desire-limit/desire-limit.component';
import { CreditCardUsageLimitComponent } from './component/credit-card-usage-limit/credit-card-usage-limit.component';
import { CreditCardInternaltionalLimitComponent } from './component/credit-card-internaltional-limit/credit-card-internaltional-limit.component';


const routes: Routes = [
  {
    path: "",
    component: ManageCreditCardComponent,
    children: [
      { path: "", redirectTo: "card-control", pathMatch: "full" },
      {
        path: "card-control",
        component: CreditCardControlComponent,
        children: [
          { path: "", redirectTo: "increase-limit", pathMatch: "full" },
          { path: "increase-limit", component: IncreaseLimitComponent },
          { path: "desire-limit", component: DesireLimitComponent  },
        ],
      },
      {
        path: "card-usage",
        component: CreditCardUsageLimitComponent,
        children: [
          { path: "", redirectTo: "domestic-limits", pathMatch: "full" },
          { path: "domestic-limits", component: CreditCardUsageLimitComponent },
          { path: "desire-limit", component: CreditCardInternaltionalLimitComponent },
        ],
      },
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageCreditCardModuleRoutingModule { }
