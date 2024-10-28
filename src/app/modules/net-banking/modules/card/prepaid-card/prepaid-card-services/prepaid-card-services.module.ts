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
import { PrepaidBlockCardComponent } from "./components/prepaid-block-card/prepaid-block-card.component";
import { PrepaidRefundComponent } from "./components/prepaid-refund/prepaid-refund.component";
import { TranslateModule } from "@ngx-translate/core";
import { PrepaidPinGenerationComponent } from "./components/prepaid-pin-generation/prepaid-pin-generation.component";

@NgModule({
  declarations: [
    PrepaidServicesComponent,
    PrepaidReloadComponent,
    PrepaidBlockCardComponent,
    PrepaidRefundComponent,
    PrepaidPinGenerationComponent,
  ],
  imports: [
    PrepaidCardServicesRoutingModule,
    CommonModule,
    SharedModule,
    RouterModule,
    FlexLayoutModule,
    SharedCardModule,
    TranslateModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class PrepaidCardServicesModule {}
