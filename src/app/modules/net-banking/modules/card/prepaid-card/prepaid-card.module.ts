import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PrepaidCardRoutingModule } from "./prepaid-card-routing.module";
import { TranslateModule } from "@ngx-translate/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedModule } from "app/shared/shared.module";
import { RouterModule } from "@angular/router";
import { SharedMaterialModule } from "app/shared/shared-material.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PrepaidCardRoutingModule,
    TranslateModule,
    FlexLayoutModule,
    SharedModule,
    SharedMaterialModule,
    RouterModule,
  ],
})
export class PrepaidCardModule {}
