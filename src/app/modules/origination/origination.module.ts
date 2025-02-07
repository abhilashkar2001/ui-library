import { NgModule } from '@angular/core';
import { OriginationRoutingModule } from './origination-routing.module';
import { OriginationComponent } from './origination/origination.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [OriginationComponent],
  imports: [CommonModule, OriginationRoutingModule],
})
export class OriginationModule {}
