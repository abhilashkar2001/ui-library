import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { NavigationService } from './services/navigation.service';
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
    ReactiveFormsModule,
  ],
  exports: [SharedComponentsModule, SharedPipesModule, SharedDirectivesModule],
})
export class SharedModule {}
