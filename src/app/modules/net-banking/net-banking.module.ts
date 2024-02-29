import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NetBankingHomeComponent } from "./net-banking-home.component";
import { NetBankingRoutingModule } from "./net-banking-routing.module";
import { SharedComponentsModule } from "app/shared/components/shared-components.module";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { BulkUploadComponent } from "./bulk-upload/bulk-upload.component";
import { AddBulkUploadComponent } from "./bulk-upload/add-bulk-upload/add-bulk-upload.component";
import { UploadBulkUploadComponent } from "./bulk-upload/upload-bulk-upload/upload-bulk-upload.component";
import { NetBankingDashboardComponent } from "./net-banking-dashboard/net-banking-dashboard/net-banking-dashboard.component";
import { SharedModule } from "app/shared/shared.module";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
@NgModule({
  declarations: [
    NetBankingHomeComponent,
    BulkUploadComponent,
    AddBulkUploadComponent,
    UploadBulkUploadComponent,
    ,
    NetBankingDashboardComponent,
  ],
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
    MatToolbarModule,
  ],
})
export class NetBankingModule {}
