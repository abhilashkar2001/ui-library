import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoanServicesRoutingModule } from "./loan-services-routing.module";
import { DisbursementScheduleComponent } from "./loan-services/disbursement-schedule/disbursement-schedule.component";
import { RepaymentCycleComponent } from "./loan-services/repayment-cycle/repayment-cycle.component";
import { TopupLoanComponent } from "./loan-services/topup-loan/topup-loan.component";
import { DisbursmentRequestComponent } from "./loan-services/disbursment-request/disbursment-request.component";
import { RepaymentScheduleComponent } from "./loan-services/repayment-schedule/repayment-schedule.component";
import { LoanRepaymentComponent } from "./loan-services/loan-repayment/loan-repayment.component";
import { TranslateModule } from "@ngx-translate/core";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedComponentsModule } from "app/shared/components/shared-components.module";
import { ModifyTenureComponent } from "./loan-services/modify-tenure/modify-tenure.component";
import { EStatementComponent } from "./loan-services/e-statement/e-statement.component";
import { InterestStatementComponent } from "./loan-services/interest-statement/interest-statement.component";
import { ViewStatementComponent } from "./loan-services/view-statement/view-statement.component";
import { PreGeneratedStatementComponent } from "./loan-services/pre-generated-statement/pre-generated-statement.component";
import { RequestCertificateComponent } from "./loan-services/request-certificate/request-certificate.component";
import { GoldRenewalComponent } from "./loan-services/gold-renewal/gold-renewal.component";
import { SharedPipesModule } from "../../../../../shared/pipes/shared-pipes.module";

@NgModule({
  declarations: [
    DisbursementScheduleComponent,
    RepaymentCycleComponent,
    TopupLoanComponent,
    DisbursmentRequestComponent,
    RepaymentScheduleComponent,
    LoanRepaymentComponent,
    ModifyTenureComponent,
    EStatementComponent,
    InterestStatementComponent,
    ViewStatementComponent,
    PreGeneratedStatementComponent,
    RequestCertificateComponent,
    GoldRenewalComponent
  ],
  imports: [
    CommonModule,
    LoanServicesRoutingModule,
    TranslateModule,
    SharedMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    SharedComponentsModule,
    SharedPipesModule
  ]
})
export class LoanServicesModule {}
