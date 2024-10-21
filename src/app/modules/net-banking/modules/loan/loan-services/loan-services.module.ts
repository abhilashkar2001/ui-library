import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanServicesRoutingModule } from './loan-services-routing.module';
import { DisbursementScheduleComponent } from './loan-services/disbursement-schedule/disbursement-schedule.component';
import { RepaymentCycleComponent } from './loan-services/repayment-cycle/repayment-cycle.component';
import { TopupLoanComponent } from './loan-services/topup-loan/topup-loan.component';
import { DisbursmentRequestComponent } from './loan-services/disbursment-request/disbursment-request.component';
import { RepaymentScheduleComponent } from './loan-services/repayment-schedule/repayment-schedule.component';


@NgModule({
  declarations: [
    DisbursementScheduleComponent,
    RepaymentCycleComponent,
    TopupLoanComponent,
    DisbursmentRequestComponent,
    RepaymentScheduleComponent
  ],
  imports: [
    CommonModule,
    LoanServicesRoutingModule
  ]
})
export class LoanServicesModule { }
