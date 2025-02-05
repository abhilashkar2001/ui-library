import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'account',
    loadChildren: () =>
      import('./modules/create-account/create-account.module').then(
        (m) => m.CreateAccountModule,
      ),
    data: { preload: false, title: 'Home', breadcrumb: 'Home' },
  },
  {
    path: 'card',
    loadChildren: () =>
      import('./modules/cards/cards.module').then((m) => m.CardsModule),
    data: { preload: false, title: 'Home', breadcrumb: 'Home' },
  },
  {
    path: 'deposits',
    loadChildren: () =>
      import('./modules/new-deposit/new-deposit.module').then(
        (m) => m.NewDepositModule,
      ),
    data: { preload: false, title: 'Home', breadcrumb: 'Home' },
  },
  {
    path: 'loan',
    loadChildren: () =>
      import('./modules/loans/loans.module').then((m) => m.LoansModule),
    data: { preload: false, title: 'Home', breadcrumb: 'Home' },
  },
  {
    path: 'tracking',
    loadChildren: () =>
      import('./modules/tracking/tracking.module').then(
        (m) => m.TrackingModule,
      ),
    data: { preload: false, title: 'Home', breadcrumb: 'Home' },
  },
  {
    path: 'request-processing',
    loadChildren: () =>
      import(
        './modules/origination-external-callback/origination-external-callback.module'
      ).then((m) => m.OriginationExternalCallbackModule),
    data: { preload: false, title: 'Home', breadcrumb: 'Home' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OriginationRoutingModule {}
