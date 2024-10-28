import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PrepaidServicesComponent } from "./prepaid-services/prepaid-services.component";
import { PrepaidReloadComponent } from "./components/prepaid-reload/prepaid-reload.component";
import { PrepaidBlockCardComponent } from "./components/prepaid-block-card/prepaid-block-card.component";
import { PrepaidRefundComponent } from "./components/prepaid-refund/prepaid-refund.component";
import { PrepaidPinGenerationComponent } from "./components/prepaid-pin-generation/prepaid-pin-generation.component";

const routes: Routes = [
  {
    path: "",
    component: PrepaidServicesComponent,
    children: [
      {
        path: "",
        redirectTo: "reload",
        pathMatch: "full",
      },
      {
        path: "reload",
        component: PrepaidReloadComponent,
      },
      {
        path: "pin-generation",
        component: PrepaidPinGenerationComponent,
      },
      {
        path: "block-card",
        component: PrepaidBlockCardComponent,
      },
      {
        path: "refund",
        component: PrepaidRefundComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrepaidCardServicesRoutingModule {}
