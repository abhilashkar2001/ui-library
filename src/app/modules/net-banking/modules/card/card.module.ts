import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "app/shared/shared.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatLegacySlideToggleModule as MatSlideToggleModule } from "@angular/material/legacy-slide-toggle";
import { SharedComponentsModule } from "app/shared/components/shared-components.module";
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { CardRoutingModule } from "./card-routing.module";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CardRoutingModule,
    FormsModule,
    SharedModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    MatCardModule,
    MatSlideToggleModule,
    TranslateModule,
  ],
})
export class CardModule {}
