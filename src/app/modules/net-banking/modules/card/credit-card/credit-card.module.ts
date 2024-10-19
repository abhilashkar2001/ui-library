import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoreModule, FlexLayoutModule } from "@angular/flex-layout";
import { SharedModule } from "app/shared/shared.module";
import { CreditCardRoutingModule } from "./credit-card-routing.module";
import { TranslateModule } from "@ngx-translate/core";
import { SharedCardModule } from "../shared-card/shared-card.module";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { MatCardModule } from "@angular/material/card";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedComponentsModule } from "app/shared/components/shared-components.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CreditCardRoutingModule,
    FlexLayoutModule,
    SharedModule,
    TranslateModule,
    SharedCardModule,
    SharedMaterialModule,
    CoreModule,
  ],
})
export class CreditCardModule {}
