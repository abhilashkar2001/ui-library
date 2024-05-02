import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FundTransferRoutingModule } from './fund-transfer-routing.module';
import { FundTransferComponent } from './fund-transfer/fund-transfer.component';
import { SingleFundTransferComponent } from './single-fund-transfer/single-fund-transfer.component';


@NgModule({
  declarations: [
    FundTransferComponent,
    SingleFundTransferComponent
  ],
  imports: [
    CommonModule,
    FundTransferRoutingModule
  ]
})
export class FundTransferModule { }
