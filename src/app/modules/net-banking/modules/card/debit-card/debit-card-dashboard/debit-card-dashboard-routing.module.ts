import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DebitCardDashboardComponent } from "./debit-card-dashboard/debit-card-dashboard.component";

const routes: Routes = [{ path: "", component: DebitCardDashboardComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebitCardDashboardRoutingModule {}
