import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateAccountRoutingModule } from './create-account-routing.module';
import { AccountLoginComponent } from './account-login/account-login.component';
import { AccountStagesComponent } from './account-stages/account-stages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { IcustLibraryModule } from '@onerumango/icust-element-library';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedModule } from 'app/shared/shared.module';
import { OriginationExternalCallbackModule } from '../origination/modules/origination-external-callback/origination-external-callback.module';
import { SharedOriginationModule } from '../origination/modules/shared-origination/shared-origination.module';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { AccountCollateralDetailsComponent } from './components/collateral-details/collateral-details.component';
import { AccountDocumentUploadComponent } from './components/document-upload/document-upload.component';
import { AccountDisbursementDetailsComponent } from './components/disbursement-details/disbursement-details.component';
import { AccountDigitalSignatureComponent } from './components/digital-signature/digital-signature.component';
import { AccountSummaryComponent } from './components/summary/summary.component';
import { AccountDirectorDetailsComponent } from './components/director-details/director-details.component';
import { AccountSignaturePopupComponent } from './components/digital-signature/signature-popup/signature-popup.component';
import { AddAccountCollateralComponent } from './components/collateral-details/add-collateral/add-collateral.component';

@NgModule({
  declarations: [
    AccountLoginComponent,
    AccountStagesComponent,
    AccountDetailsComponent,
    AccountCollateralDetailsComponent,
    AccountDocumentUploadComponent,
    AccountDisbursementDetailsComponent,
    AccountDigitalSignatureComponent,
    AccountSummaryComponent,
    AccountDirectorDetailsComponent,
    AccountSignaturePopupComponent,
    AddAccountCollateralComponent,
  ],
  imports: [
    CommonModule,
    CreateAccountRoutingModule,
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
export class CreateAccountModule {}
