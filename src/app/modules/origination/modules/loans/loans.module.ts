import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoansLandingComponent } from './pages/loans-landing/loans-landing.component';
import { SharedModule } from 'app/shared/shared.module';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { LoanFlowComponent } from './pages/loan-flow/loan-flow.component';
import { CommonEmiCalculatorComponent } from './components/common-emi-calculator/common-emi-calculator.component';
import { LoanProductsComponent } from './components/loan-products/loan-products.component';
import { IcustLibraryModule } from '@onerumango/icust-element-library';
import { LoanAccountTypeComponent } from './pages/loan-account-type/loan-account-type.component';
import { LoansComponent } from './loans/loans.component';
import { LoansRoutingModule } from './loans-routing.module';
import { SharedOriginationModule } from '../shared-origination/shared-origination.module';
import { DynamicPagesModule } from '../dynamic-pages/dynamic-pages.module';

@NgModule({
  declarations: [
    LoansComponent,
    LoanAccountTypeComponent,
    LoansLandingComponent,
    LoanFlowComponent,
    CommonEmiCalculatorComponent,
    LoanProductsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SharedMaterialModule,
    LoansRoutingModule,
    SharedComponentsModule,
    FlexLayoutModule,
    IcustLibraryModule,
    SharedOriginationModule,
    DynamicPagesModule,
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class LoansModule {}
