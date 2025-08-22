import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CardLandingComponent } from '../card/card-landing/card-landing.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'loan',
    pathMatch: 'full',
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
  {
    path: 'account-type',
    loadChildren: () =>
      import('./modules/shared-origination/shared-origination.module').then(
        (m) => m.SharedOriginationModule,
      ),
    data: { preload: false, title: 'Home', breadcrumb: 'Home' },
  },

  {
    path: 'card-landing',
    component: CardLandingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OriginationRoutingModule {}
