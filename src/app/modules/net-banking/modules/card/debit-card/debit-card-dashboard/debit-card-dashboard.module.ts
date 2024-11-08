import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedCardModule } from "../../shared-card/shared-card.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { DebitCardDashboardComponent } from "./debit-card-dashboard/debit-card-dashboard.component";
import { DebitCardDashboardRoutingModule } from "./debit-card-dashboard-routing.module";

@NgModule({
  declarations: [DebitCardDashboardComponent],
  imports: [
    CommonModule,
    SharedModule,
    FlexLayoutModule,
    SharedCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    DebitCardDashboardRoutingModule,
  ],
})
export class DebitCardDashboardModule {}
