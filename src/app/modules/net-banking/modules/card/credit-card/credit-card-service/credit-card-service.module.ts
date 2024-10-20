import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PaymentComponent } from "./components/payment/payment.component";
import { CreditCardServiceRoutingModule } from "./credit-card-service-routing.module";
import { CreditCardServiceComponent } from "./credit-card-service/credit-card-service.component";
import { SharedModule } from "app/shared/shared.module";
import { CoreModule, FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ConvertToEmiComponent } from "./components/convert-to-emi/convert-to-emi.component";
import { SharedCardModule } from "../../shared-card/shared-card.module";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { MatCardModule } from "@angular/material/card";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@NgModule({
  declarations: [
    PaymentComponent,
    CreditCardServiceComponent,
    ConvertToEmiComponent,
  ],
  imports: [
    CommonModule,
    CreditCardServiceRoutingModule,
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
export class CreditCardServiceModule {}
