import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'app/shared/shared.module';
import { CoreModule, FlexLayoutModule } from '@ngbracket/ngx-layout';

import { TranslateModule } from '@ngx-translate/core';
import { ManageCreditCardComponent } from './manage-credit-card.component';
import { CreditCardControlComponent } from './component/credit-card-control/credit-card-control.component';
import { CreditCardUsageLimitComponent } from './component/credit-card-usage-limit/credit-card-usage-limit.component';
import { ManageCreditCardModuleRoutingModule } from './manage-credit-card-module-routing.module';
import { SharedCardModule } from '../../shared-card/shared-card.module';
import { DesireLimitComponent } from './component/credit-card-control/pages/desire-limit/desire-limit.component';
import { IncreaseLimitComponent } from './component/credit-card-control/pages/increase-limit/increase-limit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { CreditCardInternaltionalLimitComponent } from './component/credit-card-internaltional-limit/credit-card-internaltional-limit.component';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { IcustLibraryModule } from '@onerumango/icust-element-library';

@NgModule({
  declarations: [
    CreditCardControlComponent,
    CreditCardUsageLimitComponent,
    ManageCreditCardComponent,
    DesireLimitComponent,
    IncreaseLimitComponent,
    CreditCardInternaltionalLimitComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FlexLayoutModule,
    SharedModule,
    ManageCreditCardModuleRoutingModule,
    TranslateModule,
    SharedCardModule,
    FormsModule,
    SharedMaterialModule,
    CoreModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSlideToggleModule,
    IcustLibraryModule,
  ],
})
export class ManageCreditCardModule {}
