import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditCardDashboardComponent } from './credit-card-dashboard.component';

const routes: Routes = [{ path: '', component: CreditCardDashboardComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditCardDashboardRoutingModule {}
