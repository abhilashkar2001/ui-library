import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionsRoutingModule } from './sessions-routing.module';
import { SigninComponent } from './signin/signin.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { NgOtpInputModule } from 'ng-otp-input';
import { IcustLibraryModule } from '@onerumango/icust-element-library';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';

@NgModule({
  declarations: [SigninComponent],
  imports: [
    CommonModule,
    SessionsRoutingModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    FlexLayoutModule,
    NgOtpInputModule,
    IcustLibraryModule,
    SharedPipesModule,
  ],
})
export class SessionsModule {}
