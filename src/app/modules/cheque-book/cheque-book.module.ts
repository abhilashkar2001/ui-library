import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChequeBookRoutingModule } from './cheque-book-routing.module';
// import { ChequeBookLoginComponent } from './cheque-book-login/cheque-book-login.component';
import { ChequeBookStagesComponent } from './cheque-book-stages/cheque-book-stages.component';
import { AccountServiceComponent } from './components/account-service/account-service.component';
import { ChequeBookDetailsComponent } from './components/cheque-book-details/cheque-book-details.component';
import { PaymentDetailsComponent } from './components/payment-details/payment-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { IcustLibraryModule } from '@onerumango/icust-element-library';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedModule } from 'app/shared/shared.module';
import { DynamicPagesModule } from '../origination/modules/dynamic-pages/dynamic-pages.module';
import { OriginationExternalCallbackModule } from '../origination/modules/origination-external-callback/origination-external-callback.module';
import { SharedOriginationModule } from '../origination/modules/shared-origination/shared-origination.module';

@NgModule({
  declarations: [
    // ChequeBookLoginComponent,
    ChequeBookStagesComponent,
    AccountServiceComponent,
    ChequeBookDetailsComponent,
    PaymentDetailsComponent,
  ],
  imports: [
    CommonModule,
    ChequeBookRoutingModule,
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChequeBookModule {}
