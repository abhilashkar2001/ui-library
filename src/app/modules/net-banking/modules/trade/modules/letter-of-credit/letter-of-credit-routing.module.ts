import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BgSummaryComponent } from '../shared-trade/bg-summary/bg-summary.component';
import { ApplicantsInfoComponent } from 'app/modules/net-banking/modules/trade/modules/shared-trade/applicants-info/applicants-info.component';
import { AttachmentsComponent } from 'app/modules/net-banking/modules/trade/modules/shared-trade/attachments/attachments.component';
import { OthersInfoComponent } from 'app/modules/net-banking/modules/trade/modules/shared-trade/others-info/others-info.component';
import { GenericBgComponentComponent } from '../shared-trade/generic-bg-component/generic-bg-component.component';
import { LcInfoComponent } from 'app/modules/net-banking/modules/trade/modules/letter-of-credit/pages/lc-info/lc-info.component';
import { GoodsInfoComponent } from 'app/modules/net-banking/modules/trade/modules/letter-of-credit/pages/goods-info/goods-info.component';
import { LcAdditionalInfoComponent } from 'app/modules/net-banking/modules/trade/modules/letter-of-credit/pages/lc-additional-info/lc-additional-info.component';
import { AmendmentLcInfoComponent } from 'app/modules/net-banking/modules/trade/modules/letter-of-credit/pages/amendment-lc-info/amendment-lc-info.component';
import { LcAmendementInfoComponent } from 'app/modules/net-banking/modules/trade/modules/letter-of-credit/pages/lc-amendement-info/lc-amendement-info.component';
import { UploadBulkUploadComponent } from '../shared-trade/upload-bulk-upload/upload-bulk-upload.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'lc-issuance',
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
            path: 'lc-info',
            component: LcInfoComponent,
          },
          {
            path: 'goods-info',
            component: GoodsInfoComponent,
          },
          {
            path: 'document-info-46A',
            component: UploadBulkUploadComponent,
          },
          {
            path: 'additional-info',
            component: LcAdditionalInfoComponent,
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
    path: 'lc-amendment',
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
            redirectTo: 'lc-info',
            pathMatch: 'full',
          },
          {
            path: 'lc-info',
            component: LcInfoComponent,
          },
          {
            path: 'amendment-info',
            component: AmendmentLcInfoComponent,
          },
          {
            path: 'other-conditions',
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
    path: 'draft-lc-issuance',
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
            path: 'lc-info',
            component: LcInfoComponent,
          },
          {
            path: 'goods-info',
            component: GoodsInfoComponent,
          },
          {
            path: 'document-info-46A',
            component: UploadBulkUploadComponent,
          },
          {
            path: 'additional-info',
            component: LcAdditionalInfoComponent,
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
    path: 'lc-physical-amendment',
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
            redirectTo: 'lc-amendment-info',
            pathMatch: 'full',
          },
          {
            path: 'lc-amendment-info',
            component: LcAmendementInfoComponent,
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
export class LetterOfCreditRoutingModule {}
