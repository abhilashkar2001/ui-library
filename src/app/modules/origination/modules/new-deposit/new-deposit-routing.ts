import { Routes } from '@angular/router';
import { NewDepositComponent } from './new-deposit/new-deposit.component';
import { DepositLandingPageComponent } from './new-deposit/deposit-landing-page/deposit-landing-page.component';
import { FdCalculatorComponent } from './new-deposit/fd-calculator/fd-calculator.component';
import { FixedDepositDetailsComponent } from './new-deposit/fd-calculator/fixed-deposit-details/fixed-deposit-details.component';
import { RdCalculatorComponent } from './new-deposit/rd-calculator/rd-calculator.component';

export const NewDepositRoutes: Routes = [
  {
    path: '',
    component: NewDepositComponent,
    children: [
      {
        path: '',
        redirectTo: 'landing',
        pathMatch: 'full',
      },
      {
        path: 'landing',
        component: DepositLandingPageComponent,
      },
      {
        path: 'fdFlow',
        component: FdCalculatorComponent,
        children: [
          {
            path: 'fdDetails/:id/:code',
            component: FixedDepositDetailsComponent,
          },
        ],
      },
      {
        path: 'rdDeposit/:id/:processCode',
        component: RdCalculatorComponent,
      },
    ],
  },
];
