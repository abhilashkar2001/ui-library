import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebitCardServiceComponent } from './debit-card-service/debit-card-service/debit-card-service.component';
import { DebitCardRoutingModule } from './debit-card-routing.module';
import { ManageDebitCardComponent } from './manage-debit-card/manage-debit-card.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [DebitCardServiceComponent, ManageDebitCardComponent],
  imports: [
    CommonModule,
    DebitCardRoutingModule,
    SharedModule,
    SharedMaterialModule,
    FlexLayoutModule,
    RouterModule,
  ],
})
export class DebitCardModule {}
