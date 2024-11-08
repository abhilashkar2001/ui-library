import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "app/shared/shared.module";
import { CoreModule, FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { SharedCardModule } from "../../shared-card/shared-card.module";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { MatLegacySlideToggleModule as MatSlideToggleModule } from "@angular/material/legacy-slide-toggle";
import { DebitCardServiceComponent } from "./debit-card-service/debit-card-service.component";
import { DebitCardServiceRoutingModule } from "./debit-card-service-routing.module";

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
