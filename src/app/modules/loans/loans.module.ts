import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  CibilScoreContainerComponent,
  CreateLoanComponent,
  ExpenseTaxBenefitCalculatorComponent,
  GoldLoanEmiCalculatorComponent,
  HLLoanEmiCalculatorComponent,
  LoanAccountTypeComponent,
  LoanDocumentUploadComponent,
  LoanStepperComponent,
  LoanSummaryComponent,
  LoanUserPersonalDetailsComponent,
  LoanUserSelectKycComponent,
  LoansComponent,
  LoansRoutingModule,
  MobileVerificationComponent,
  NormalLoanEmiCalculatorComponent,
  LoanTermsConditionsComponent,
  CreateLoanLandingPageComponent,
  PersonalDetailsWithMultipleCustomerComponent,
} from ".";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { LoansLandingComponent } from "./loans-landing/loans-landing.component";
import { SharedModule } from "app/shared/shared.module";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { SharedComponentsModule } from "app/shared/components/shared-components.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { LoanFlowComponent } from "./loan-flow/loan-flow.component";
import { CommonEmiCalculatorComponent } from "./loan-calculator/common-emi-calculator/common-emi-calculator.component";
import { PersonalCustomDetailsComponent } from "./personal-details/personal-details.component";

@NgModule({
  declarations: [
    LoansComponent,
    LoanAccountTypeComponent,
    NormalLoanEmiCalculatorComponent,
    LoanStepperComponent,
    CreateLoanComponent,
    MobileVerificationComponent,
    LoanDocumentUploadComponent,
    LoanTermsConditionsComponent,
    LoanSummaryComponent,
    CibilScoreContainerComponent,
    LoanUserPersonalDetailsComponent,
    LoanUserSelectKycComponent,
    GoldLoanEmiCalculatorComponent,
    HLLoanEmiCalculatorComponent,
    ExpenseTaxBenefitCalculatorComponent,
    CreateLoanLandingPageComponent,
    PersonalDetailsWithMultipleCustomerComponent,
    LoansLandingComponent,
    LoanFlowComponent,
    CommonEmiCalculatorComponent,
    PersonalCustomDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPopoverModule,
    SharedModule,
    SharedMaterialModule,
    LoansRoutingModule,
    SharedComponentsModule,
    FlexLayoutModule,
  ],
})
export class LoansModule {}
