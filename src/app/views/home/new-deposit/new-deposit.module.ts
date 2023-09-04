import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NewDepositComponent } from "./new-deposit/new-deposit.component";
import { DepositLandingPageComponent } from "./new-deposit/deposit-landing-page/deposit-landing-page.component";
import { RouterModule } from "@angular/router";
import { NewDepositRoutes } from "./new-deposit-routing";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { FdRdCalculatorComponent } from "./new-deposit/deposit-landing-page/fd-rd-calculator/fd-rd-calculator.component";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ReturnCalculatorComponent } from "./new-deposit/deposit-landing-page/return-calculator/return-calculator.component";
import { MatRadioModule } from "@angular/material/radio";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSliderModule } from "@angular/material/slider";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { MatDividerModule } from "@angular/material/divider";
import { MatSelectModule } from "@angular/material/select";
import { MaturityCalculatorComponent } from "./new-deposit/deposit-landing-page/return-calculator/maturity-calculator/maturity-calculator.component";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { GrowthFdAnimationComponent } from "./new-deposit/deposit-landing-page/growth-fd-animation/growth-fd-animation.component";
import { DepositFaqComponent } from "./new-deposit/deposit-landing-page/deposit-faq/deposit-faq.component";
import { NewsLetterSliderComponent } from "./new-deposit/deposit-landing-page/news-letter-slider/news-letter-slider.component";
import {
  NgbCarousel,
  NgbCarouselModule,
  NgbSlideEvent,
  NgbSlideEventSource,
} from "@ng-bootstrap/ng-bootstrap";
import { FdCalculatorComponent } from "./new-deposit/fd-calculator/fd-calculator.component";
import { FixedDepositDetailsComponent } from "./new-deposit/fd-calculator/fixed-deposit-details/fixed-deposit-details.component";
import { VerifyNumberComponent } from "./new-deposit/fd-calculator/verify-number/verify-number.component";
import { PersonalDetailsComponent } from "./new-deposit/fd-calculator/personal-details/personal-details.component";
import { BookFdComponent } from "./new-deposit/fd-calculator/book-fd/book-fd.component";
import { PaymentMethodComponent } from "./new-deposit/fd-calculator/book-fd/payment-method/payment-method.component";
import { SharedDirectivesModule } from "app/shared/directives/shared-directives.module";
import { RdCalculatorComponent } from "./new-deposit/rd-calculator/rd-calculator.component";
import { CreateCdComponent } from "./new-deposit/rd-calculator/create-cd/create-cd.component";
import { OtherDocumentsComponent } from "./new-deposit/rd-calculator/other-documents/other-documents.component";
import { NgOtpInputModule } from "ng-otp-input";
import { SharedComponentsModule } from "app/shared/components/shared-components.module";

@NgModule({
  declarations: [
    NewDepositComponent,
    DepositLandingPageComponent,
    FdRdCalculatorComponent,
    ReturnCalculatorComponent,
    MaturityCalculatorComponent,
    GrowthFdAnimationComponent,
    DepositFaqComponent,
    NewsLetterSliderComponent,
    FdCalculatorComponent,
    FixedDepositDetailsComponent,
    VerifyNumberComponent,
    PersonalDetailsComponent,
    BookFdComponent,
    PaymentMethodComponent,
    RdCalculatorComponent,
    CreateCdComponent,
    OtherDocumentsComponent,
  ],
  imports: [
    CommonModule,
    NgbCarouselModule,
    FlexLayoutModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    FormsModule,
    MatRadioModule,
    MatSliderModule,
    MatCheckboxModule,
    MatSelectModule,
    SharedMaterialModule,
    SharedDirectivesModule,
    SharedComponentsModule,
    RouterModule.forChild(NewDepositRoutes),
  ],
})
export class NewDepositModule {}
