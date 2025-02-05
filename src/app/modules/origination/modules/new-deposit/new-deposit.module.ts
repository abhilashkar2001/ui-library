import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { SharedDirectivesModule } from 'app/shared/directives/shared-directives.module';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedModule } from 'app/shared/shared.module';
import { NgOtpInputModule } from 'ng-otp-input';
import { NewDepositRoutes } from './new-deposit-routing';
import { DepositFaqComponent } from './new-deposit/deposit-landing-page/deposit-faq/deposit-faq.component';
import { DepositLandingPageComponent } from './new-deposit/deposit-landing-page/deposit-landing-page.component';
import { FdRdCalculatorComponent } from './new-deposit/deposit-landing-page/fd-rd-calculator/fd-rd-calculator.component';
import { GrowthFdAnimationComponent } from './new-deposit/deposit-landing-page/growth-fd-animation/growth-fd-animation.component';
import { InfoPopupComponent } from './new-deposit/deposit-landing-page/return-calculator/info-popup/info-popup.component';
import { MaturityCalculatorComponent } from './new-deposit/deposit-landing-page/return-calculator/maturity-calculator/maturity-calculator.component';
import { ReturnCalculatorComponent } from './new-deposit/deposit-landing-page/return-calculator/return-calculator.component';
import { BookFdComponent } from './new-deposit/fd-calculator/book-fd/book-fd.component';
import { PaymentMethodComponent } from './new-deposit/fd-calculator/book-fd/payment-method/payment-method.component';
import { FdCalculatorComponent } from './new-deposit/fd-calculator/fd-calculator.component';
import { FixedDepositDetailsComponent } from './new-deposit/fd-calculator/fixed-deposit-details/fixed-deposit-details.component';
import { PersonalDetailsComponent } from './new-deposit/fd-calculator/personal-details/personal-details.component';
import { VerifyNumberComponent } from './new-deposit/fd-calculator/verify-number/verify-number.component';
import { NewDepositComponent } from './new-deposit/new-deposit.component';
import { CreateCdComponent } from './new-deposit/rd-calculator/create-cd/create-cd.component';
import { RdCalculatorComponent } from './new-deposit/rd-calculator/rd-calculator.component';
import { MatSliderModule } from '@angular/material/slider';
import { IcustLibraryModule } from '@onerumango/icust-element-library';

@NgModule({
  declarations: [
    NewDepositComponent,
    DepositLandingPageComponent,
    FdRdCalculatorComponent,
    ReturnCalculatorComponent,
    MaturityCalculatorComponent,
    GrowthFdAnimationComponent,
    DepositFaqComponent,
    FdCalculatorComponent,
    FixedDepositDetailsComponent,
    VerifyNumberComponent,
    PersonalDetailsComponent,
    BookFdComponent,
    PaymentMethodComponent,
    RdCalculatorComponent,
    CreateCdComponent,
    InfoPopupComponent,
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
    SharedModule,
    SharedComponentsModule,
    IcustLibraryModule,
    RouterModule.forChild(NewDepositRoutes),
  ],
})
export class NewDepositModule {}
