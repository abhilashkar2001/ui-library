import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BgSummaryComponent } from '../shared-trade/bg-summary/bg-summary.component';
import { GenericBgComponentComponent } from '../shared-trade/generic-bg-component/generic-bg-component.component';
import { ApplicantsInfoComponent } from 'app/modules/net-banking/modules/trade/modules/shared-trade/applicants-info/applicants-info.component';
import { OthersInfoComponent } from 'app/modules/net-banking/modules/trade/modules/shared-trade/others-info/others-info.component';
import { AttachmentsComponent } from 'app/modules/net-banking/modules/trade/modules/shared-trade/attachments/attachments.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'summary',
    pathMatch: 'full',
  },
  {
    path: 'summary',
    component: BgSummaryComponent,
  },
  {
    path: 'add',
    component: GenericBgComponentComponent,
    children: [
      {
        path: '',
        redirectTo: 'applicant-details',
      },
      {
        path: 'applicant-details',
        component: ApplicantsInfoComponent,
      },
      {
        path: 'other-details',
        component: OthersInfoComponent,
      },
      {
        path: 'attachments',
        component: AttachmentsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RemittanceRoutingModule {}
