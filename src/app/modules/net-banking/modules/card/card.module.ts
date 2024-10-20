import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "app/shared/shared.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { SharedComponentsModule } from "app/shared/components/shared-components.module";
import { MatCardModule } from "@angular/material/card";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { CardRoutingModule } from "./card-routing.module";

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
  ],
})
export class CardModule {}
