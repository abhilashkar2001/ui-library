import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanRoutingModule } from './loan-routing.module';
import { LoanDashboardComponent } from './loan-dashboard/loan-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { MatCardModule } from '@angular/material/card';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { LoanServiceDashboardComponent } from './loan-services/loan-service-dashboard/loan-service-dashboard.component';


@NgModule({
  declarations: [
    LoanDashboardComponent,
    LoanServiceDashboardComponent,
  ],
  imports: [
    CommonModule,
    LoanRoutingModule,
    FormsModule,
    SharedModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    SharedMaterialModule,
    MatCardModule,

  ]
})
export class LoanModule { }
