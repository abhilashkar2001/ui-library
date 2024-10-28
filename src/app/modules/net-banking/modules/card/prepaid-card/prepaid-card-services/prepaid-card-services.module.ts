import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { PrepaidServicesComponent } from "./prepaid-services/prepaid-services.component";
import { SharedModule } from "app/shared/shared.module";
import { RouterModule } from "@angular/router";
import { PrepaidReloadComponent } from "./components/prepaid-reload/prepaid-reload.component";
import { PrepaidCardServicesRoutingModule } from "./prepaid-card-service-routing.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedCardModule } from "../../shared-card/shared-card.module";
import { PrepaidRefundComponent } from "./components/prepaid-refund/prepaid-refund.component";
import { TranslateModule } from "@ngx-translate/core";
import { SharedMaterialModule } from "app/shared/shared-material.module";

@NgModule({
  declarations: [
    PrepaidServicesComponent,
    PrepaidReloadComponent,
    PrepaidRefundComponent,
  ],
  imports: [
    PrepaidCardServicesRoutingModule,
    CommonModule,
    SharedModule,
    RouterModule,
    FlexLayoutModule,
    SharedCardModule,
    TranslateModule,
    SharedMaterialModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class PrepaidCardServicesModule {}
