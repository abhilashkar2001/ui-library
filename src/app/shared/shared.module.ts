import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// SERVICES
import { ThemeService } from './services/theme.service';
import { NavigationService } from './services/navigation.service';
import { AppConfirmService } from './services/app-confirm/app-confirm.service';
import { AppLoaderService } from './services/app-loader/app-loader.service';

import { SharedComponentsModule } from './components/shared-components.module';
import { SharedPipesModule } from './pipes/shared-pipes.module';
import { SharedDirectivesModule } from './directives/shared-directives.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { InputMaskModule } from './directives/input-mask/input-mask.module';
import { RoutePartsService } from '@onerumango/utils';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    SharedPipesModule,
    SharedDirectivesModule,
    NgOtpInputModule,
    InputMaskModule,
  ],
  providers: [
    ThemeService,
    NavigationService,
    RoutePartsService,
    AppConfirmService,
    AppLoaderService,
    ReactiveFormsModule,
  ],
  exports: [SharedComponentsModule, SharedPipesModule, SharedDirectivesModule],
})
export class SharedModule {}
