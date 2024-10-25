import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedModule } from "app/shared/shared.module";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { TranslateModule } from "@ngx-translate/core";
import { DashboardCardPreviewComponent } from "./components/dashboard-card-preview/dashboard-card-preview.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { SharedComponentsModule } from "app/shared/components/shared-components.module";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { DashboardCardDetailsComponent } from "./components/dashboard-card-details/dashboard-card-details.component";
import { DashboardCardListComponent } from "./components/dashboard-card-list/dashboard-card-list.component";
import { GetStatementPopupComponent } from "./get-statement-popup/get-statement-popup.component";
import { GeneratePinComponent } from "./components/generate-pin/generate-pin.component";

const components = [
  DashboardCardPreviewComponent,
  DashboardCardDetailsComponent,
  DashboardCardListComponent,
  GetStatementPopupComponent,
  GeneratePinComponent,
];
@NgModule({
  declarations: components,
  exports: components,
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatCardModule,
    TranslateModule,
    SharedMaterialModule,
    ClipboardModule,
  ],
})
export class SharedCardModule {}
