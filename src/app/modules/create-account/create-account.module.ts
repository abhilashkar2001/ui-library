import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateAccountRoutingModule } from './create-account-routing.module';
import { AccountLoginComponent } from './account-login/account-login.component';
import { AccountStagesComponent } from './account-stages/account-stages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { IcustLibraryModule } from '@onerumango/icust-element-library';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedModule } from 'app/shared/shared.module';
import { OriginationExternalCallbackModule } from '../origination/modules/origination-external-callback/origination-external-callback.module';
import { SharedOriginationModule } from '../origination/modules/shared-origination/shared-origination.module';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { AccountDocumentUploadComponent } from './components/document-upload/document-upload.component';
import { AccountDigitalSignatureComponent } from './components/digital-signature/digital-signature.component';
import { AccountSummaryComponent } from './components/summary/summary.component';
import { AccountSignaturePopupComponent } from './components/digital-signature/signature-popup/signature-popup.component';
import { AccountSelectionComponent } from './components/account-selection/account-selection.component';
import { PersonalIdentificationComponent } from './components/personal-identification/personal-identification.component';
import { AccountPersonalDetailsComponent } from './components/personal-details/personal-details.component';
import { GenericAccountFormComponent } from './components/personal-details/generic-account-form/generic-account-form.component';
import { DynamicPagesModule } from '../origination/modules/dynamic-pages/dynamic-pages.module';
import { EmpFinDetailsComponent } from './components/emp-fin-details/emp-fin-details.component';
import { GenericEmpFinDetailsComponent } from './components/emp-fin-details/generic-emp-fin-details/generic-emp-fin-details.component';
import { CustomAccountDetailsComponent } from '../origination/modules/shared-origination/custom-account-details/custom-account-details.component';
import { AccountServicesComponent } from './components/account-services/account-services.component';


@NgModule({
  declarations: [
    AccountLoginComponent,
    AccountStagesComponent,
    AccountDetailsComponent,
    AccountDocumentUploadComponent,
    AccountPersonalDetailsComponent,
    AccountDigitalSignatureComponent,
    AccountSummaryComponent,
    AccountSignaturePopupComponent,
    AccountSelectionComponent,
    PersonalIdentificationComponent,
    GenericAccountFormComponent,
    EmpFinDetailsComponent,
    GenericEmpFinDetailsComponent,
    CustomAccountDetailsComponent,
    AccountServicesComponent,
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
    OriginationExternalCallbackModule,
    DynamicPagesModule,
  ],
})
export class CreateAccountModule {}
