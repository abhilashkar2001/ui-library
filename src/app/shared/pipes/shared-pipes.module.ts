import { NgModule } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";

import { RelativeTimePipe } from "./relative-time.pipe";
import { ExcerptPipe } from "./excerpt.pipe";
import { GetValueByKeyPipe } from "./get-value-by-key.pipe";
import { SearchOptionsPipe } from "./search-options.pipe";
import { TextMaskPipe } from "./text-mask.pipe";
import { CustomCurrencyPipe } from "./custom-currency.pipe";
import { FormArrayPipe } from "./formarray.pipe";
import { FormControlPipe } from "./formcontrol.pipe";
import { FormGroupPipe } from "./formgroup.pipe";

const pipes = [
  RelativeTimePipe,
  ExcerptPipe,
  GetValueByKeyPipe,
  SearchOptionsPipe,
  TextMaskPipe,
  CustomCurrencyPipe,
  FormArrayPipe,
  FormControlPipe,
  FormGroupPipe
];

@NgModule({
  imports: [CommonModule],
  declarations: pipes,
  exports: pipes,
  providers: [CurrencyPipe]
})
export class SharedPipesModule {}
