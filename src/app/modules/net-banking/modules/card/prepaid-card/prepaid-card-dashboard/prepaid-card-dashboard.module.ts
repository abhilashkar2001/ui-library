import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrepaidDashboardComponent } from './prepaid-dashboard/prepaid-dashboard.component';
import { PrepaidCardDashboardRoutingModule } from './prepaid-card-dashboard-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { SharedCardModule } from '../../shared-card/shared-card.module';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

import { SharedMaterialModule } from 'app/shared/shared-material.module';

@NgModule({
  declarations: [PrepaidDashboardComponent],
  imports: [
    CommonModule,
    PrepaidCardDashboardRoutingModule,
    SharedModule,
    SharedMaterialModule,
    SharedCardModule,
    FlexLayoutModule,
  ],
})
export class PrepaidCardDashboardModule {}
