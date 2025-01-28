import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetterOfCreditRoutingModule } from './letter-of-credit-routing.module';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedTradeModule } from '../shared-trade/shared-trade.module';
import { LcInfoComponent } from 'app/modules/net-banking/modules/trade/modules/letter-of-credit/pages/lc-info/lc-info.component';
import { GoodsInfoComponent } from 'app/modules/net-banking/modules/trade/modules/letter-of-credit/pages/goods-info/goods-info.component';
import { LcAdditionalInfoComponent } from 'app/modules/net-banking/modules/trade/modules/letter-of-credit/pages/lc-additional-info/lc-additional-info.component';
import { AmendmentLcInfoComponent } from 'app/modules/net-banking/modules/trade/modules/letter-of-credit/pages/amendment-lc-info/amendment-lc-info.component';
import { LcAmendementInfoComponent } from 'app/modules/net-banking/modules/trade/modules/letter-of-credit/pages/lc-amendement-info/lc-amendement-info.component';
import { LcOtherConditionsComponent } from './pages/lc-other-conditions/lc-other-conditions.component';

@NgModule({
  declarations: [
    LcInfoComponent,
    GoodsInfoComponent,
    LcAdditionalInfoComponent,
    AmendmentLcInfoComponent,
    LcAmendementInfoComponent,
    LcOtherConditionsComponent,
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    SharedMaterialModule,
    SharedTradeModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    TranslateModule,
    LetterOfCreditRoutingModule,
  ],
})
export class LetterOfCreditModule {}
