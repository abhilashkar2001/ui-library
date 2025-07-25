import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { StagesComponent } from './stages/stages.component';
import { LoanDetailsComponent } from './components/loan-details/loan-details.component';
import { DocumentUploadComponent } from './components/document-upload/document-upload.component';
import { BusinessDetailsComponent } from './components/business-details/business-details.component';
import { DirectorDetailsComponent } from './components/director-details/director-details.component';
import { DisbursementDetailsComponent } from './components/disbursement-details/disbursement-details.component';
import { CreditBureauComponent } from './components/credit-bureau/credit-bureau.component';
import { CollateralDetailsComponent } from './components/collateral-details/collateral-details.component';
import { TermsConditionComponent } from './components/terms-condition/terms-condition.component';
import { SummaryComponent } from './components/summary/summary.component';
import { DigitalSignatureComponent } from './components/digital-signature/digital-signature.component';
import { LoanRoutingModule } from './loan-routing.module';
import { SharedMaterialModule } from '../../shared/shared-material.module';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { SharedModule } from 'app/shared/shared.module';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { IcustLibraryModule } from '@onerumango/icust-element-library';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedOriginationModule } from '../origination/modules/shared-origination/shared-origination.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OriginationExternalCallbackModule } from '../origination/modules/origination-external-callback/origination-external-callback.module';
import { SignaturePopupComponent } from './components/digital-signature/signature-popup/signature-popup.component';
import { EmiCalculatorComponent } from './emi-calculator/emi-calculator.component';
import { CalculatorDialogComponent } from './dialogs/calculator-dialog/calculator-dialog.component';
import { AddCollateralComponent } from './components/collateral-details/add-collateral/add-collateral.component';
import { LibPipesModule } from '@onerumango/utils';
import { EmiCalculatorDrawerComponent } from 'app/modules/loan/emi-calculator/emi-calculator-drawer/emi-calculator-drawer.component';
import { DocumentDetailsComponent } from './components/document-details/document-details.component';

@NgModule({
  declarations: [
    LoginComponent,
    StagesComponent,
    LoanDetailsComponent,
    DocumentUploadComponent,
    BusinessDetailsComponent,
    DirectorDetailsComponent,
    DisbursementDetailsComponent,
    CreditBureauComponent,
    CollateralDetailsComponent,
    TermsConditionComponent,
    SummaryComponent,
    DigitalSignatureComponent,
    SignaturePopupComponent,
    EmiCalculatorComponent,
    CalculatorDialogComponent,
    AddCollateralComponent,
    EmiCalculatorDrawerComponent,
    DocumentDetailsComponent,
  ],
  imports: [
    CommonModule,
    LoanRoutingModule,
    SharedMaterialModule,
    SharedComponentsModule,
    SharedModule,
    FlexLayoutModule,
    IcustLibraryModule,
    SharedPipesModule,
    FormsModule,
    ReactiveFormsModule,
    SharedOriginationModule,
    MatFormFieldModule,
    OriginationExternalCallbackModule,
    LibPipesModule,
  ],
})
export class LoanModule {}
