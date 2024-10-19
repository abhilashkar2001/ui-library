import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "app/shared/shared.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { SharedComponentsModule } from "app/shared/components/shared-components.module";
import { MatCardModule } from "@angular/material/card";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { CreditCardDashboardComponent } from "./credit-card/credit-card-dashboard/credit-card-dashboard.component";
import { CreditCardRoutingModule } from "./credit-card/credit-card-routing.module";

@NgModule({
  declarations: [CreditCardDashboardComponent],
  imports: [
    CommonModule,
    CreditCardRoutingModule,
    FormsModule,
    SharedModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    MatCardModule,
    MatSlideToggleModule,
  ],
})
export class CardModule {}
