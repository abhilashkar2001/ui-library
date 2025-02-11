import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalaryAccountRoutingModule } from './salary-account-routing.module';
import { SalaryAccountComponent } from './salary-account/salary-account.component';
import { AddSalaryAccountComponent } from './add-salary-account/add-salary-account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { SharedCorporateBankingModule } from '../../../shared-corporate-banking/shared-corporate-banking.module';

@NgModule({
  declarations: [SalaryAccountComponent, AddSalaryAccountComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedMaterialModule,
    FlexLayoutModule,
    SharedComponentsModule,
    SalaryAccountRoutingModule,
    SharedCorporateBankingModule,
  ],
})
export class SalaryAccountModule {}
