import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "app/shared/shared.module";
import { CoreModule, FlexLayoutModule } from "@angular/flex-layout";
import { TranslateModule } from "@ngx-translate/core";
import { ManageCreditCardComponent } from "./manage-credit-card.component";
import { CreditCardControlComponent } from "./component/credit-card-control/credit-card-control.component";
import { CreditCardUsageLimitComponent } from "./component/credit-card-usage-limit/credit-card-usage-limit.component";
import { ManageCreditCardModuleRoutingModule } from "./manage-credit-card-module-routing.module";
import { SharedCardModule } from "../../shared-card/shared-card.module";
import { DesireLimitComponent } from "./component/credit-card-control/pages/desire-limit/desire-limit.component";
import { IncreaseLimitComponent } from "./component/credit-card-control/pages/increase-limit/increase-limit.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { MatLegacySlideToggleModule as MatSlideToggleModule } from "@angular/material/legacy-slide-toggle";
import { CreditCardInternaltionalLimitComponent } from "./component/credit-card-internaltional-limit/credit-card-internaltional-limit.component";

@NgModule({
  declarations: [
    CreditCardControlComponent,
    CreditCardUsageLimitComponent,
    ManageCreditCardComponent,
    DesireLimitComponent,
    IncreaseLimitComponent,
    CreditCardInternaltionalLimitComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FlexLayoutModule,
    SharedModule,
    ManageCreditCardModuleRoutingModule,
    TranslateModule,
    SharedCardModule,
    FormsModule,
    SharedMaterialModule,
    CoreModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSlideToggleModule,
  ],
})
export class ManageCreditCardModule {}
