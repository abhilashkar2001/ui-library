import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";
import { CreditCardDashboardRoutingModule } from "./credit-card-dashboard-routing.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedCardModule } from "../../shared-card/shared-card.module";
import { CreditCardDashboardComponent } from "./credit-card-dashboard.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { SharedComponentsModule } from "app/shared/components/shared-components.module";

@NgModule({
  declarations: [CreditCardDashboardComponent],
  imports: [
    CommonModule,
    CreditCardDashboardRoutingModule,
    SharedModule,
    FlexLayoutModule,
    SharedCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
  ],
})
export class CreditCardDashboardModule {}
