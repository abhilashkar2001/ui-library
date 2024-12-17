import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'app/shared/shared.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardCardPreviewComponent } from './components/dashboard-card-preview/dashboard-card-preview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { DashboardCardDetailsComponent } from './components/dashboard-card-details/dashboard-card-details.component';
import { DashboardCardListComponent } from './components/dashboard-card-list/dashboard-card-list.component';
import { GetStatementPopupComponent } from './get-statement-popup/get-statement-popup.component';
import { GeneratePinComponent } from './components/generate-pin/generate-pin.component';
import { PinGenerationComponent } from './components/pin-generation/pin-generation.component';
import { UpgradeComponent } from './components/upgrade/upgrade.component';
import { BlockCardComponent } from './components/block-card/block-card.component';
import { SelectNewCardPopupComponent } from './components/select-new-card-popup/select-new-card-popup.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { MatCardModule } from '@angular/material/card';

const components = [
  DashboardCardPreviewComponent,
  DashboardCardDetailsComponent,
  DashboardCardListComponent,
  GetStatementPopupComponent,
  GeneratePinComponent,
  PinGenerationComponent,
  UpgradeComponent,
  BlockCardComponent,
  SelectNewCardPopupComponent,
];
@NgModule({
  declarations: components,
  exports: components,
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatCardModule,
    TranslateModule,
    SharedMaterialModule,
    ClipboardModule,
    NgOtpInputModule,
  ],
})
export class SharedCardModule {}
