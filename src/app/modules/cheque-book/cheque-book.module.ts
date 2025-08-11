import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChequeBookRoutingModule } from './cheque-book-routing.module';
import { ChequeBookLoginComponent } from './cheque-book-login/cheque-book-login.component';
import { ChequeBookStagesComponent } from './cheque-book-stages/cheque-book-stages.component';
import { AccountServiceComponent } from './components/account-service/account-service.component';
import { ChequeBookDetailsComponent } from './components/cheque-book-details/cheque-book-details.component';
import { PaymentDetailsComponent } from './components/payment-details/payment-details.component';


@NgModule({
  declarations: [
    ChequeBookLoginComponent,
    ChequeBookStagesComponent,
    AccountServiceComponent,
    ChequeBookDetailsComponent,
    PaymentDetailsComponent
  ],
  imports: [
    CommonModule,
    ChequeBookRoutingModule
  ]
})
export class ChequeBookModule { }
