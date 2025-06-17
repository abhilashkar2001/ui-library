import { ModuleWithProviders, NgModule } from '@angular/core';
import { INPUT_MASK_CONFIG, InputMaskConfig } from './config';
import { InputMaskDirective } from './input-mask.directive';

@NgModule({
  declarations: [InputMaskDirective],
  exports: [InputMaskDirective],
  providers: [
    {
      provide: INPUT_MASK_CONFIG,
      useClass: InputMaskConfig,
    },
  ],
})
export class InputMaskModule {
  static forRoot(
    config?: Partial<InputMaskConfig>,
  ): ModuleWithProviders<InputMaskModule> {
    return {
      ngModule: InputMaskModule,
      providers: [{ provide: INPUT_MASK_CONFIG, useValue: config }],
    };
  }
}
