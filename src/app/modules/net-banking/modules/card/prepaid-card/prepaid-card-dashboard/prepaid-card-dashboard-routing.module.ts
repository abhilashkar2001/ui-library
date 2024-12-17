import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrepaidDashboardComponent } from './prepaid-dashboard/prepaid-dashboard.component';

const routes: Routes = [{ path: '', component: PrepaidDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrepaidCardDashboardRoutingModule {}
