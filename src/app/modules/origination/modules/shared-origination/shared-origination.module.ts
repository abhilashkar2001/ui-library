import { NgModule } from '@angular/core';
import { NewReusableFilterComponent } from '../../../net-banking/modules/shared-corporate-banking/new-reusable-filter/new-reusable-filter.component';
import { CommonModule } from '@angular/common';

const components = [NewReusableFilterComponent];
@NgModule({
  declarations: components,
  imports: [CommonModule],
  exports: components,
})
export class SharedOriginationModule {}
