import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageDebitCardComponent } from './manage-debit-card.component';
import { FlexLayoutModule, CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedModule } from 'app/shared/shared.module';
import { SharedCardModule } from '../../shared-card/shared-card.module';
import { ManageDebitCardRoutingModule } from './manage-debit-card-routing.module';



@NgModule({
  declarations: [
    ManageDebitCardComponent
  ],
  imports: [
    CommonModule,
    ManageDebitCardRoutingModule,
    SharedModule,
    FlexLayoutModule,
    SharedModule,
    TranslateModule,
    SharedCardModule,
    FormsModule,
    SharedMaterialModule,
    CoreModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSlideToggleModule,
  ]
})
export class ManageDebitCardModule { }
