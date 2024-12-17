import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenericBgComponentComponent } from '../shared-trade/generic-bg-component/generic-bg-component.component';
import { BgSummaryComponent } from '../shared-trade/bg-summary/bg-summary.component';
import { BgInfoComponent } from 'app/modules/net-banking/modules/trade/modules/bank-guarantee/pages/bg-info/bg-info.component';
import { AttachmentsComponent } from 'app/modules/net-banking/modules/trade/modules/shared-trade/attachments/attachments.component';
import { OthersInfoComponent } from 'app/modules/net-banking/modules/trade/modules/shared-trade/others-info/others-info.component';
import { AmendementInfoComponent } from 'app/modules/net-banking/modules/trade/modules/bank-guarantee/pages/amendement-info/amendement-info.component';
import { ApplicantsInfoComponent } from 'app/modules/net-banking/modules/trade/modules/shared-trade/applicants-info/applicants-info.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'bg-issuance',
    pathMatch: 'full',
  },
  {
    path: 'bg-issuance',
    children: [
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
            redirectTo: 'applicants-info',
            pathMatch: 'full',
          },
          {
            path: 'applicants-info',
            component: ApplicantsInfoComponent,
          },
          {
            path: 'bg-info',
            component: BgInfoComponent,
          },
          {
            path: 'other-info',
            component: OthersInfoComponent,
          },
          {
            path: 'attachments',
            component: AttachmentsComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'bg-amendment',
    children: [
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
            redirectTo: 'bg-info',
            pathMatch: 'full',
          },
          {
            path: 'bg-info',
            component: BgInfoComponent,
          },
          {
            path: 'amendment-info',
            component: AmendementInfoComponent,
          },
          {
            path: 'other-info',
            component: OthersInfoComponent,
          },
          {
            path: 'attachments',
            component: AttachmentsComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'bg-physical-amedment',
    children: [
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
            redirectTo: 'amendment-info',
            pathMatch: 'full',
          },
          {
            path: 'amendment-info',
            component: AmendementInfoComponent,
          },
          {
            path: 'attachments',
            component: AttachmentsComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'bg-templates',
    children: [
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
            redirectTo: 'applicants-info',
            pathMatch: 'full',
          },
          {
            path: 'applicants-info',
            component: ApplicantsInfoComponent,
          },
          {
            path: 'bg-info',
            component: BgInfoComponent,
          },
          {
            path: 'other-info',
            component: OthersInfoComponent,
          },
          {
            path: 'attachments',
            component: AttachmentsComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankGuaranteeRoutingModule {}
