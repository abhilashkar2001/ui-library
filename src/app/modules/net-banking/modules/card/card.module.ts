import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { CardRoutingModule } from './card-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CardRoutingModule,
    FormsModule,
    SharedModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    MatCardModule,
    MatSlideToggleModule,
    TranslateModule,
  ],
})
export class CardModule {}
