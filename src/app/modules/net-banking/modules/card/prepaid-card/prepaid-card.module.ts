import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrepaidCardRoutingModule } from './prepaid-card-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedCorporateBankingModule } from '../../shared-corporate-banking/shared-corporate-banking.module';
import { SharedCardModule } from '../shared-card/shared-card.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PrepaidCardRoutingModule,
    TranslateModule,
    FlexLayoutModule,
    SharedModule,
    SharedMaterialModule,
    RouterModule,
    SharedCardModule,
    SharedCorporateBankingModule,
  ],
})
export class PrepaidCardModule {}
