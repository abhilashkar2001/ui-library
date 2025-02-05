import { NgModule } from '@angular/core';
import { OriginationRoutingModule } from './origination-routing.module';
import { OriginationComponent } from './origination/origination.component';

@NgModule({
  declarations: [OriginationComponent],
  imports: [OriginationRoutingModule],
})
export class OriginationModule {}
