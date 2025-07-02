import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { StagesComponent } from './stages/stages.component';
import { LoanDetailsComponent } from './components/loan-details/loan-details.component';
import { DocumentUploadComponent } from './components/document-upload/document-upload.component';
import { BusinessDetailsComponent } from './components/business-details/business-details.component';
import { DirectorsDocumentUploadComponent } from './components/directors-document-upload/directors-document-upload.component';
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

@NgModule({
  declarations: [
    LoginComponent,
    StagesComponent,
    LoanDetailsComponent,
    DocumentUploadComponent,
    BusinessDetailsComponent,
    DirectorsDocumentUploadComponent,
    DirectorDetailsComponent,
    DisbursementDetailsComponent,
    CreditBureauComponent,
    CollateralDetailsComponent,
    TermsConditionComponent,
    SummaryComponent,
    DigitalSignatureComponent,
    SignaturePopupComponent,
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
  ],
})
export class LoanModule {}
