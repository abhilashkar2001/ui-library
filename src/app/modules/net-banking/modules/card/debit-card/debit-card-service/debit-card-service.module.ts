import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "app/shared/shared.module";
import { CoreModule, FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { SharedCardModule } from "../../shared-card/shared-card.module";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { DebitCardServiceComponent } from "./debit-card-service/debit-card-service.component";
import { DebitCardServiceRoutingModule } from "./debit-card-service-routing.module";
import { MatCardModule } from "@angular/material/card";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@NgModule({
  declarations: [DebitCardServiceComponent],
  imports: [
    CommonModule,
    DebitCardServiceRoutingModule,
    FlexLayoutModule,
    SharedModule,
    TranslateModule,
    SharedCardModule,
    SharedMaterialModule,
    CoreModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSlideToggleModule,
  ],
})
export class DebitCardServiceModule {}
