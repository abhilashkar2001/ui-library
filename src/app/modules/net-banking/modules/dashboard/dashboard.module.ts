import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { NetBankingDashboardComponent } from './net-banking-dashboard/net-banking-dashboard.component';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { IcustLibraryModule } from '@onerumango/icust-element-library';

@NgModule({
  declarations: [NetBankingDashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    SharedMaterialModule,
    TranslateModule,
    DashboardRoutingModule,
    MatExpansionModule,
    IcustLibraryModule,
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule {}
