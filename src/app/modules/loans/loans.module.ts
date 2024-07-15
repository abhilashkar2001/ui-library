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
  LoanSummaryComponent,
  LoansComponent,
  LoansRoutingModule,
  NormalLoanEmiCalculatorComponent,
  LoanTermsConditionsComponent,
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
import { LoanProductsComponent } from "./loan-account-type/loan-products/loan-products.component";
import { AgricultureEmiCalculatorComponent } from "./loan-calculator/agriculture-emi-calculator/agriculture-emi-calculator.component";
import { HomeLoanCalculatorComponent } from "./loan-calculator/home-loan-calculator/home-loan-calculator.component";
import { ExpenseDetailsComponent } from "./loan-calculator/education-loan-calculator/expense-details/expense-details.component";
import { EducationLoanCalculatorComponent } from "./loan-calculator/education-loan-calculator/education-loan-calculator.component";
import { KnowYourEmiComponent } from "./loan-calculator/education-loan-calculator/know-your-emi/know-your-emi.component";
import { TaxBenefitsComponent } from "./loan-calculator/education-loan-calculator/tax-benefits/tax-benefits.component";
import { NationalIdUploadComponent } from "../../shared/components/national-id-upload/national-id-upload.component";
import { CookieService } from 'ngx-cookie-service';
@NgModule({
  declarations: [
    LoansComponent,
    LoanAccountTypeComponent,
    NormalLoanEmiCalculatorComponent,
    CreateLoanComponent,
    LoanDocumentUploadComponent,
    LoanTermsConditionsComponent,
    LoanSummaryComponent,
    CibilScoreContainerComponent,
    GoldLoanEmiCalculatorComponent,
    HLLoanEmiCalculatorComponent,
    ExpenseTaxBenefitCalculatorComponent,
    LoansLandingComponent,
    LoanFlowComponent,
    CommonEmiCalculatorComponent,
    LoanProductsComponent,
    AgricultureEmiCalculatorComponent,
    HomeLoanCalculatorComponent,
    EducationLoanCalculatorComponent,
    ExpenseDetailsComponent,
    KnowYourEmiComponent,
    TaxBenefitsComponent,
    NationalIdUploadComponent,
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
  providers:[CookieService],
})
export class LoansModule {}
