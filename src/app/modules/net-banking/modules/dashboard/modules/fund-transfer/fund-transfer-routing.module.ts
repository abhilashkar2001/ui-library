import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingleFundTransferComponent } from './single-fund-transfer/single-fund-transfer.component';
import { MultiFundTransferComponent } from './multi-fund-transfer/multi-fund-transfer.component';
import { CreditCardPaymentComponent } from './credit-card-payment/credit-card-payment.component';
import { FundTransferSummaryComponent } from './fund-transfer-summary/fund-transfer-summary.component';
import { AddBulkUploadComponent } from './add-bulk-upload/add-bulk-upload.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { PendingForApprovalComponent } from './pending-for-approval/pending-for-approval.component';

const routes: Routes = [
  {
    path: 'fund-transfer-summary',
    component: FundTransferSummaryComponent,
  },
  {
    path: 'single',
    component: SingleFundTransferComponent,
  },
  {
    path: 'multi',
    component: MultiFundTransferComponent,
  },
  {
    path: 'credit-card',
    component: CreditCardPaymentComponent,
  },
  {
    path: 'pending-for-approval',
    component: PendingForApprovalComponent,
  },
  {
    path: 'bulk-upload',
    component: BulkUploadComponent,
  },
  {
    path: 'bulk-upload/:id',
    component: AddBulkUploadComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FundTransferRoutingModule {}
