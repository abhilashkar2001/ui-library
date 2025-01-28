import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FlexLayoutModule, CoreModule } from '@angular/flex-layout';
import { CoreModule, FlexLayoutModule } from '@ngbracket/ngx-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedModule } from 'app/shared/shared.module';
import { SharedCardModule } from '../../shared-card/shared-card.module';
import { ManageDebitCardRoutingModule } from './manage-debit-card-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [],
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
  ],
})
export class ManageDebitCardModule {}
