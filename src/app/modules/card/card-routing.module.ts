import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StagesComponent } from './stages/stages.component';
import { LoginComponent } from '../loan/login/login.component';
import { CardComponent } from './card.component';
import { AccountTypeComponent } from '../cheque-book/components/account-type/account-type.component';

const routes: Routes = [
  {
    path: '',
    component: CardComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
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
        path: 'account-type',
        component: AccountTypeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardRoutingModule {}
