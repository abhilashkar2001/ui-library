import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoreModule, FlexLayoutModule } from "@angular/flex-layout";
import { SharedModule } from "app/shared/shared.module";
import { CreditCardRoutingModule } from "./credit-card-routing.module";
import { TranslateModule } from "@ngx-translate/core";
import { SharedCardModule } from "../shared-card/shared-card.module";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ManageCreditCardComponent } from './manage-credit-card/manage-credit-card.component';
import { CreditCardControlComponent } from './manage-credit-card/component/credit-card-control/credit-card-control.component';
import { CreditCardUsageLimitComponent } from './manage-credit-card/component/credit-card-usage-limit/credit-card-usage-limit.component';
import { CreditCardInternaltionalLimitComponent } from './manage-credit-card/component/credit-card-internaltional-limit/credit-card-internaltional-limit.component';

@NgModule({
  declarations: [
    ManageCreditCardComponent,
    CreditCardControlComponent,
    CreditCardUsageLimitComponent,
    CreditCardInternaltionalLimitComponent
  ],
  imports: [
    CommonModule,
    CreditCardRoutingModule,
    FlexLayoutModule,
    SharedModule,
    TranslateModule,
    SharedCardModule,
    SharedMaterialModule,
    CoreModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSlideToggleModule,
  ],
})
export class CreditCardModule {}
