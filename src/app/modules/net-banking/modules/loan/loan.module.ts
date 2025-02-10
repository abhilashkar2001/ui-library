import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanRoutingModule } from './loan-routing.module';
import { LoanDashboardComponent } from './loan-dashboard/loan-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { LoanServiceDashboardComponent } from './loan-services/loan-service-dashboard/loan-service-dashboard.component';
import { LoanSummaryComponent } from './loan-summary/loan-summary.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { IcustLibraryModule } from '@onerumango/icust-element-library';
import { SharedCorporateBankingModule } from '../shared-corporate-banking/shared-corporate-banking.module';

@NgModule({
  declarations: [
    LoanDashboardComponent,
    LoanServiceDashboardComponent,
    LoanSummaryComponent,
  ],
  imports: [
    CommonModule,
    LoanRoutingModule,
    FormsModule,
    SharedModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    SharedMaterialModule,
    MatCardModule,
    TranslateModule,
    ClipboardModule,
    IcustLibraryModule,
    SharedCorporateBankingModule,
  ],
})
export class LoanModule {}
