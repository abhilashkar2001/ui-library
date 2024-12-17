import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanAccountTypeComponent, LoansComponent } from '.';
import { LoansLandingComponent } from './loans-landing/loans-landing.component';
import { LoanFlowComponent } from './loan-flow/loan-flow.component';

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
