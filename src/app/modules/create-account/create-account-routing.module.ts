import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountLoginComponent } from './account-login/account-login.component';
import { AccountStagesComponent } from './account-stages/account-stages.component';
import { CreateAccountComponent } from './create-account.component';
import { LoansLandingComponent } from '../origination/modules/loans/pages/loans-landing/loans-landing.component';

const routes: Routes = [
  {
    path: '',
    component: CreateAccountComponent,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: 'landing',
        component: LoansLandingComponent,
      },
      {
        path: 'login',
        component: AccountLoginComponent,
      },
      {
        path: 'stages',
        component: AccountStagesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateAccountRoutingModule {}
