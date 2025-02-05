import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CardCibilScoreComponent,
  CardDiverseComponent,
  CardMobileVerificationComponent,
  CardPersonalDetailsComponent,
  CardSelectKycComponent,
  CardStepperComponent,
  CardTermsConditionsComponent,
  CardTypeComponent,
  CardsComponent,
  CreateCardLandingPageComponent,
  cardsRoutes,
} from './index';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { CardLandingComponent } from './card-landing/card-landing.component';
import { RouterModule } from '@angular/router';
import { IcustLibraryModule } from '@onerumango/icust-element-library';

@NgModule({
  declarations: [
    CardsComponent,
    CardTypeComponent,
    CardStepperComponent,
    CardMobileVerificationComponent,
    CardCibilScoreComponent,
    CardPersonalDetailsComponent,
    CardSelectKycComponent,
    CardTermsConditionsComponent,
    CardDiverseComponent,
    CreateCardLandingPageComponent,
    CardLandingComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SharedMaterialModule,
    IcustLibraryModule,
    RouterModule.forChild(cardsRoutes),
  ],
})
export class CardsModule {}
