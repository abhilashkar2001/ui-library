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

  /** Net Banking Login Route */
  // {
  //   path: 'sessions',
  //   component: AuthLayoutComponent,
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () =>
  //         import('./modules/sessions/sessions.module').then(
  //           (m) => m.SessionsModule,
  //         ),
  //     },
  //   ],
  // },

  /** Corporate Banking Module Route */
  // {
  //   path: 'user',
  //   component: UserLayoutComponent,
  //   canActivate: [AuthGuard],
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () =>
  //         import('./modules/net-banking/net-banking.module').then(
  //           (m) => m.NetBankingModule,
  //         ),
  //     },
  //   ],
  // },
  {
    path: '**',
    redirectTo: 'home/404',
  },
];
