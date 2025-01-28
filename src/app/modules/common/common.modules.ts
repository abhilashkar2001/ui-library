import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { CommonBtnGroupComponent } from './common-btn-group/common-btn-group.component';

@NgModule({
  declarations: [CommonBtnGroupComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedMaterialModule,
    SharedModule,

    FlexLayoutModule,
    ReactiveFormsModule,
  ],
})
export class CommonButtonGroupModule {}
