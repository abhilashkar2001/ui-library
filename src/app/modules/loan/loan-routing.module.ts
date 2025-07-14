import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { StagesComponent } from './stages/stages.component';
import { LoanComponent } from './loan.component';
import { LoanDetailsComponent } from './components/loan-details/loan-details.component';
import { DisbursementDetailsComponent } from './components/disbursement-details/disbursement-details.component';
import { EmiCalculatorComponent } from './emi-calculator/emi-calculator.component';

const routes: Routes = [
  {
    path: '',
    component: LoanComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'emi-calculator',
        component: EmiCalculatorComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'stages',
        component: StagesComponent,
      },
      {
        path: 'loan-details',
        component: LoanDetailsComponent,
      },
      {
        path: 'disbursement',
        component: DisbursementDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoanRoutingModule {}
