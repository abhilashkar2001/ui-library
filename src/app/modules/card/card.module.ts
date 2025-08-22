import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardRoutingModule } from './card-routing.module';
import { StagesComponent } from './stages/stages.component';
import { EmploymentFinancialDetailsComponent } from './components/employment-financial-details/employment-financial-details.component';
import { CardSummaryComponent } from './components/summary/card-summary.component';
import { CardDetailsComponent } from './components/card-details/card-details.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { IcustLibraryModule } from '@onerumango/icust-element-library';
import { LibPipesModule } from '@onerumango/utils';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { OriginationExternalCallbackModule } from '../origination/modules/origination-external-callback/origination-external-callback.module';
import { SharedOriginationModule } from '../origination/modules/shared-origination/shared-origination.module';
import { CommonPersonalDetailsComponent } from './components/common-personal-details/common-personal-details.component';
import { CardLandingComponent } from './card-landing/card-landing.component';
import { CardCatalogueComponent } from './card-catalogue/card-catalogue.component';
import { AboutCardComponent } from './about-card/about-card.component';
import { CardBannerComponent } from './card-banner/card-banner.component';
import { CardAdvertisementComponent } from './card-advertisement/card-advertisement.component';
import { OverViewComponent } from './about-card/over-view/over-view.component';
import { BenefitsComponent } from './about-card/benefits/benefits.component';

@NgModule({
  declarations: [
    StagesComponent,
    EmploymentFinancialDetailsComponent,
    CardSummaryComponent,
    CardDetailsComponent,
    CommonPersonalDetailsComponent,
    CardLandingComponent,
    CardCatalogueComponent,
    AboutCardComponent,
    CardBannerComponent,
    CardAdvertisementComponent,
    OverViewComponent,
    BenefitsComponent,
  ],
  imports: [
    CommonModule,
    CardRoutingModule,
    SharedModule,
    SharedMaterialModule,
    SharedComponentsModule,
    FlexLayoutModule,
    IcustLibraryModule,
    SharedPipesModule,
    FormsModule,
    ReactiveFormsModule,
    SharedOriginationModule,
    MatFormFieldModule,
    OriginationExternalCallbackModule,
    LibPipesModule,
  ],
})
export class CardModule {}
