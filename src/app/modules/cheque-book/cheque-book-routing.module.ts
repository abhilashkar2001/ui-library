import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChequeBookComponent } from './cheque-book.component';
// import { ChequeBookLoginComponent } from './cheque-book-login/cheque-book-login.component';
import { ChequeBookStagesComponent } from './cheque-book-stages/cheque-book-stages.component';
import { AccountTypeComponent } from './components/account-type/account-type.component';

const routes: Routes = [
  {
    path: '',
    component: ChequeBookComponent,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
      // {
      //   path: 'landing',
      //   component: LoansLandingComponent,
      // },
      // {
      //   path: 'login',
      //   component: ChequeBookLoginComponent,
      // },
      {
        path: 'stages',
        component: ChequeBookStagesComponent,
      },
      {
        path: 'account-type',
        component: AccountTypeComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChequeBookRoutingModule {}
