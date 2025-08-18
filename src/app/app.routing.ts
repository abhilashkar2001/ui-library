import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from './shared/guards/auth.guard';
// import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
// import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.compone/nt';

export const rootRouterConfig: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  /** This is the default routing for the landing page */
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
    data: { title: 'Loading' },
  },

  /** This is the default route for origination section where customer can
   * apply for Loan
   */
  {
    path: 'origination',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/origination/origination.module').then(
            (m) => m.OriginationModule,
          ),
      },
    ],
  },
  {
    path: 'loan',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/loan/loan.module').then((m) => m.LoanModule),
      },
    ],
  },
  {
    path: 'create-account',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/create-account/create-account.module').then(
            (m) => m.CreateAccountModule,
          ),
      },
    ],
  },
  {
    path: 'cheque-book',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/cheque-book/cheque-book.module').then(
            (m) => m.ChequeBookModule,
          ),
      },
    ],
  },
  {
    path: 'apply-card',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/card/card.module').then((m) => m.CardModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home/404',
  },
];
