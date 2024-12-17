import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetBankingHomeComponent } from './net-banking-home/net-banking-home.component';

const routes: Routes = [
  {
    path: '',
    component: NetBankingHomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule,
          ),
      },
      {
        path: 'trade',
        loadChildren: () =>
          import('./modules/trade/trade.module').then((m) => m.TradeModule),
      },
      {
        path: 'loan',
        loadChildren: () =>
          import('./modules/loan/loan.module').then((m) => m.LoanModule),
      },
      {
        path: 'card',
        loadChildren: () =>
          import('./modules/card/card.module').then((m) => m.CardModule),
      },
      {
        path: 'send-money',
        loadChildren: () =>
          import('./modules/send-money/send-money.module').then(
            (m) => m.SendMoneyModule,
          ),
        data: { preload: false, title: 'Home', breadcrumb: 'Home' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetBankingRoutingModule {}
