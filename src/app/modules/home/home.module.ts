import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ErrorCode401Component } from "./error/error-code-401/error-code-401.component";

@NgModule({
  declarations: [HomeComponent, ErrorCode401Component],
  imports: [
    CommonModule,
    SharedMaterialModule,
    FlexLayoutModule,
    HomeRoutingModule,
  ],
})
export class HomeModule {}
