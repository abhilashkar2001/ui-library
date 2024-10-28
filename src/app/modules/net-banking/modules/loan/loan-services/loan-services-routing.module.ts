import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisbursmentRequestComponent } from './loan-services/disbursment-request/disbursment-request.component';
import { EStatementComponent } from './loan-services/e-statement/e-statement.component';
import { RepaymentCycleComponent } from './loan-services/repayment-cycle/repayment-cycle.component';
import { DisbursementScheduleComponent } from './loan-services/disbursement-schedule/disbursement-schedule.component';
import { PreGeneratedStatementComponent } from './loan-services/pre-generated-statement/pre-generated-statement.component';
import { InterestStatementComponent } from './loan-services/interest-statement/interest-statement.component';
import { ViewStatementComponent } from './loan-services/view-statement/view-statement.component';
import { RequestCertificateComponent } from './loan-services/request-certificate/request-certificate.component';
import { ModifyTenureComponent } from './loan-services/modify-tenure/modify-tenure.component';
import { LoanRepaymentComponent } from './loan-services/loan-repayment/loan-repayment.component';
import { TopupLoanComponent } from './loan-services/topup-loan/topup-loan.component';
import { RepaymentScheduleComponent } from './loan-services/repayment-schedule/repayment-schedule.component';
import { GoldRenewalComponent } from './loan-services/gold-renewal/gold-renewal.component';
import { LoanServiceDashboardComponent } from './loan-service-dashboard/loan-service-dashboard.component';
import { PaymentPageComponent } from '../../dashboard/modules/cheque-book/payment-page/payment-page.component';


const routes: Routes = [
  {
    path: "",
    component: LoanServiceDashboardComponent,
    children: [
      {
        path: "",
        redirectTo: "repayment-cycle",
        pathMatch: "full",
      },
      {
        path: "repayment-cycle",
        component: RepaymentCycleComponent,
      },
      {
        path: "e-statement",
        component: EStatementComponent,
      },
      {
        path: "disbursement-request",
        component: DisbursmentRequestComponent,
      },
      {
        path: "disbursement-schedule",
        component: DisbursementScheduleComponent,
      },
      {
        path: "pre-generated-statement",
        component: PreGeneratedStatementComponent,
      },
      {
        path: "view-statement",
        component: ViewStatementComponent,
      },
      {
        path: "request-certificate",
        component: RequestCertificateComponent,
      },
      {
        path: "interest-statement",
        component: InterestStatementComponent,
      },
      {
        path: "modify-tenure",
        component: ModifyTenureComponent,
      },
      {
        path: "loan-repayment",
        component: LoanRepaymentComponent,
      },
      {
        path: "loan-topUP",
        component: TopupLoanComponent,
      },
      {
        path: "repayment-schedule",
        component: RepaymentScheduleComponent,
      },
      {
        path: "gold-renewal",
        component: GoldRenewalComponent,
      },
      {
        path: "payment-summary",
        component: PaymentPageComponent,
      },
    ],
  },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanServicesRoutingModule { }
