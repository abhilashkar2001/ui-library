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
  ],
  imports: [CommonModule, LoanRoutingModule, SharedMaterialModule],
})
export class LoanModule {}
