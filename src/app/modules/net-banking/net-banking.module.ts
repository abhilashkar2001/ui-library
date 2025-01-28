import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutsModule } from 'app/layouts/layouts.module';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedModule } from 'app/shared/shared.module';
import { NetBankingHomeComponent } from './net-banking-home/net-banking-home.component';
import { NetBankingRoutingModule } from './net-banking-routing.module';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [NetBankingHomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NetBankingRoutingModule,
    SharedComponentsModule,
    SharedMaterialModule,
    FlexLayoutModule,
    SharedModule,
    MatMenuModule,
    MatToolbarModule,
    LayoutsModule,
    TranslateModule,
  ],
})
export class NetBankingModule {}
