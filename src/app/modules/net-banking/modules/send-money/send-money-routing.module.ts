import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendMoneyComponent } from './send-money/send-money.component';
import { SelfTransferComponent } from './pages/self-transfer/self-transfer.component';
import { SchedulePaymentComponent } from './pages/schedule-payment/schedule-payment.component';
import { TransferMoneyComponent } from './pages/transfer-money/transfer-money.component';
import { PaymentPageComponent } from '../dashboard/modules/cheque-book/payment-page/payment-page.component';

const routes: Routes = [
  /** By default redirect to dashboard */
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  /** Dashboard Routing with all services  */
  {
    path: 'dashboard',
    component: SendMoneyComponent,
    data: {
      title: 'Home',
    },
    children: [
      {
        path: '',
        redirectTo: 'transfer-money',
        pathMatch: 'full',
      },
      {
        path: 'transfer-money',
        component: TransferMoneyComponent,
        data: {
          title: 'Transfer Money',
        },
      },
      {
        path: 'self-transfer',
        component: SelfTransferComponent,
        data: {
          title: 'Self Transfer',
        },
      },
      {
        path: 'schedule-payment',
        component: SchedulePaymentComponent,
        data: {
          title: 'Schedule Payment',
        },
      },
    ],
  },

  /** Payment Summary Route */
  {
    path: 'payment-summary',
    component: PaymentPageComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendMoneyRoutingModule {}
