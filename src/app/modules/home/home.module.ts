import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ErrorCode401Component } from './error/error-code-401/error-code-401.component';
import { CallbackComponent } from './callback/callback.component';
import { NewErrorPopupComponent } from './new-error-popup/new-error-popup.component';
import { IcustLibraryModule } from '@onerumango/icust-element-library';

@NgModule({
  declarations: [
    HomeComponent,
    ErrorCode401Component,
    CallbackComponent,
    NewErrorPopupComponent,
  ],
  imports: [
    CommonModule,
    SharedMaterialModule,
    FlexLayoutModule,
    HomeRoutingModule,
    IcustLibraryModule,
  ],
})
export class HomeModule {}
