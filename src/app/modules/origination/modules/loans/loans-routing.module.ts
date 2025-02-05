import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoansLandingComponent } from './pages/loans-landing/loans-landing.component';
import { LoanFlowComponent } from './pages/loan-flow/loan-flow.component';
import { LoanAccountTypeComponent } from './pages/loan-account-type/loan-account-type.component';
import { LoansComponent } from './loans/loans.component';

const routes: Routes = [
  {
    path: '',
    component: LoansComponent,
    children: [
      {
        path: '',
        redirectTo: 'landing',
        pathMatch: 'full',
      },
      {
        path: 'landing',
        component: LoansLandingComponent,
      },
      {
        path: 'loan-type',
        component: LoanAccountTypeComponent,
      },
      {
        path: 'create-loan/:id',
        component: LoanFlowComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoansRoutingModule {}
