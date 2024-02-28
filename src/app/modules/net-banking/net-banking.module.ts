import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NetBankingHomeComponent } from "./net-banking-home.component";
import { NetBankingRoutingModule } from "./net-banking-routing.module";
import { NewReusableMatTableComponent } from "app/shared/components/new-reusable-mat-table/new-reusable-mat-table.component";
import { NewReusableFilterComponent } from "app/shared/components/new-reusable-filter/new-reusable-filter.component";
import { CreatedDurationModelComponent } from "app/shared/components/created-duration-model/created-duration-model.component";
import { CalendarHeaderComponent } from "app/shared/components/calendar-header/calendar-header.component";
import { SharedComponentsModule } from "app/shared/components/shared-components.module";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NetBankingDashboardComponent } from "./net-banking-dashboard/net-banking-dashboard/net-banking-dashboard.component";
import { SharedModule } from "app/shared/shared.module";
import { MatMenuModule } from "@angular/material/menu";
@NgModule({
  declarations: [NetBankingHomeComponent, NetBankingDashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NetBankingRoutingModule,
    SharedComponentsModule,
    SharedMaterialModule,
    FlexLayoutModule,
    SharedModule,
    MatMenuModule,
  ],
})
export class NetBankingModule {}
