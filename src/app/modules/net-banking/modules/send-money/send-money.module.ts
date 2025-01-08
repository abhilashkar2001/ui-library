import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendMoneyRoutingModule } from './send-money-routing.module';
import { SendMoneyComponent } from './send-money/send-money.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { SelfTransferComponent } from './pages/self-transfer/self-transfer.component';
import { SchedulePaymentComponent } from './pages/schedule-payment/schedule-payment.component';
import { TransferMoneyComponent } from './pages/transfer-money/transfer-money.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { IcustLibraryModule } from '@onerumango/icust-element-library';

@NgModule({
  declarations: [
    /** Service Outlet Component */
    SendMoneyComponent,

    /** Services */
    TransferMoneyComponent,
    SelfTransferComponent,
    SchedulePaymentComponent,
  ],
  imports: [
    CommonModule,
    SharedMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    SharedModule,
    SendMoneyRoutingModule,
    TranslateModule,
    SharedComponentsModule,
    IcustLibraryModule,
  ],
})
export class SendMoneyModule {}
