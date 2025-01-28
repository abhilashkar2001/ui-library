import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChequeBookRoutingModule } from './cheque-book-routing.module';
import { ChequeComponent } from './cheque/cheque.component';
import { ChequeStatusEnquiryComponent } from './cheque-status-enquiry/cheque-status-enquiry.component';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { StopChequeComponent } from './stop-cheque/stop-cheque.component';
import { ChequebookRequestComponent } from './chequebook-request/chequebook-request.component';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { PaymentPageComponent } from './payment-page/payment-page.component';
import { OtpComponent } from './otp/otp.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { FeedbackComponent } from './feedback/feedback.component';
import { SharedPipesModule } from '../../../../../../shared/pipes/shared-pipes.module';
import { IcustLibraryModule } from '@onerumango/icust-element-library';

@NgModule({
  declarations: [
    ChequeStatusEnquiryComponent,
    StopChequeComponent,
    ChequeComponent,
    ChequebookRequestComponent,
    PaymentDetailsComponent,
    PaymentPageComponent,
    OtpComponent,
    FeedbackComponent,
  ],
  imports: [
    CommonModule,
    ChequeBookRoutingModule,
    SharedMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    NgOtpInputModule,
    SharedPipesModule,
    IcustLibraryModule,
  ],
})
export class ChequeBookModule {}
