import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './components/payment/payment.component';
import { CreditCardServiceRoutingModule } from './credit-card-service-routing.module';
import { CreditCardServiceComponent } from './credit-card-service/credit-card-service.component';
import { SharedModule } from 'app/shared/shared.module';
import { CoreModule, FlexLayoutModule } from '@ngbracket/ngx-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ConvertToEmiComponent } from './components/convert-to-emi/convert-to-emi.component';
import { SharedCardModule } from '../../shared-card/shared-card.module';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { BillingCycleComponent } from './components/billing-cycle/billing-cycle.component';
import { EStatementComponent } from './components/e-statement/e-statement.component';
import { ChangePinComponent } from './components/change-pin/change-pin.component';
import { CardEmiDetailsComponent } from './components/card-emi-details/card-emi-details.component';
import { PreGeneratedStatementComponent } from './components/pre-generated-statement/pre-generated-statement.component';
import { InstantLoanComponent } from './components/instant-loan/instant-loan.component';
import { AlertSubscriptionComponent } from './components/alert-subscription/alert-subscription.component';
import { UnbilledTransactionComponent } from './components/unbilled-transaction/unbilled-transaction.component';
import { AddOnCardComponent } from './components/add-on-card/add-on-card.component';
import { AutoPayComponent } from './components/auto-pay/auto-pay.component';
import { CalculateEmiComponent } from './components/convert-to-emi/calculate-emi/calculate-emi.component';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { IcustLibraryModule } from '@onerumango/icust-element-library';
import { SharedCorporateBankingModule } from '../../../shared-corporate-banking/shared-corporate-banking.module';

@NgModule({
  declarations: [
    PaymentComponent,
    CreditCardServiceComponent,
    ConvertToEmiComponent,
    AutoPayComponent,
    BillingCycleComponent,
    EStatementComponent,
    ChangePinComponent,
    CardEmiDetailsComponent,
    PreGeneratedStatementComponent,
    InstantLoanComponent,
    AlertSubscriptionComponent,
    UnbilledTransactionComponent,
    AddOnCardComponent,
    CalculateEmiComponent,
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
    FormsModule,
    IcustLibraryModule,
    SharedCorporateBankingModule,
  ],
})
export class CreditCardServiceModule {}
