import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { LoansLandingComponent } from './pages/loans-landing/loans-landing.component';
import { SharedModule } from 'app/shared/shared.module';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { LoanFlowComponent } from './pages/loan-flow/loan-flow.component';
import { CommonEmiCalculatorComponent } from './components/common-emi-calculator/common-emi-calculator.component';
import { LoanProductsComponent } from './components/loan-products/loan-products.component';
import { NationalIdUploadComponent } from '../dynamic-pages/national-id-upload/national-id-upload.component';
import { IcustLibraryModule } from '@onerumango/icust-element-library';
import { CibilScoreContainerComponent } from '../dynamic-pages/cibil-score-container/cibil-score-container.component';
import { LoanTermsConditionsComponent } from '../dynamic-pages/loan-terms-conditions/loan-terms-conditions.component';
import { CreateLoanComponent } from '../dynamic-pages/create-loan/create-loan.component';
import { LoanAccountTypeComponent } from './pages/loan-account-type/loan-account-type.component';
import { LoansComponent } from './loans/loans.component';
import { LoanSummaryComponent } from '../dynamic-pages/loan-summary/loan-summary.component';
import { LoansRoutingModule } from './loans-routing.module';
@NgModule({
  declarations: [
    LoansComponent,
    LoanAccountTypeComponent,
    CreateLoanComponent,
    LoanTermsConditionsComponent,
    LoanSummaryComponent,
    CibilScoreContainerComponent,
    LoansLandingComponent,
    LoanFlowComponent,
    CommonEmiCalculatorComponent,
    LoanProductsComponent,
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
    IcustLibraryModule,
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class LoansModule {}
