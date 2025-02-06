import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewPopupComponent } from './add-new-popup/add-new-popup.component';
import { AllInOnePopupComponent } from './all-in-one-popup/all-in-one-popup.component';
import { AuditLogPopupComponent } from './audit-log/audit-log-popup/audit-log-popup.component';
import { AuditLogTableComponent } from './audit-log/audit-log-table/audit-log-table.component';
import { AduitLogDetailsComponent } from './audit-log/aduit-log-details/aduit-log-details.component';
import { BankCodePopupComponent } from './bank-code-popup/bank-code-popup.component';
import { ButtonLoadingComponent } from './button-loading/button-loading.component';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';
import { ChartPage } from './chart/chart.page';
import { CommonLevelStatusComponent } from './common-level-status/common-level-status.component';
import { CreatedDurationModelComponent } from './created-duration-model/created-duration-model.component';
import { CustomDrawerComponent } from './custom-drawer/custom-drawer.component';
import { CustomPaginationComponent } from './custom-pagination/custom-pagination.component';
import { CustomSuccessPopupComponent } from './custom-success-popup/custom-success-popup.component';
import { IcActionButtonComponent } from './ic-action-button/ic-action-button.component';
import { IcCustomAmountInput } from './ic-custom-amount-input/ic-custom-amount-input.component';
import { IcCustomInputComponent } from './ic-custom-input/ic-custom-input.component';
import { IcCustomPayFromComponent } from './ic-custom-pay-from/ic-custom-pay-from.component';
import { IcRadioButtonComponent } from './ic-radio-button/ic-radio-button.component';
import { IcRowInputComponent } from './ic-row-input/ic-row-input.component';
import { IcToggleSlideComponent } from './ic-toggle-slide/ic-toggle-slide.component';
import { InputDatePickerComponent } from './input-date-picker/input-date-picker.component';
import { MaturityChartComponent } from './maturity-chart/maturity-chart.component';
import { NewAuditlogButtonGroupComponent } from './new-auditlog-button-group/new-auditlog-button-group.component';
import { NewReusableFilterComponent } from './new-reusable-filter/new-reusable-filter.component';
import { NewReusableMatTableComponent } from './new-reusable-mat-table/new-reusable-mat-table.component';
import { PopupSuccessComponent } from './popup-success/popup-success.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { RecentTransactionComponent } from './recent-transaction/recent-transaction.component';
import { ReusableFavouritiesComponent } from './reusable-favourities/reusable-favourities.component';
import { ReusableNodatafoundComponent } from './reusable-nodatafound/reusable-nodatafound.component';
import { ReusableTableComponent } from './reusable-table/reusable-table.component';
import { SelectSingleTransferComponent } from './select-single-transfer/select-single-transfer.component';
import { SwiperComponent } from 'swiper/angular';
import { DashboardInstantPayComponent } from './widgets/dashboard-instant-pay/dashboard-instant-pay.component';
import { ExternalLinkComponent } from './widgets/external-link/external-link.component';
import { LinkPayeeSideBarComponent } from './widgets/link-payee-side-bar/link-payee-side-bar.component';
import { TabLinkComponent } from './widgets/tab-link/tab-link.component';
import { ToolbarTabComponent } from './widgets/toolbar-tab/toolbar-tab.component';
import { ToolbarTitleComponent } from './widgets/toolbar-title/toolbar-title.component';
import { TransactionCardComponent } from './widgets/transaction-card/transaction-card.component';

const components = [
  AddNewPopupComponent,
  AllInOnePopupComponent,
  AuditLogPopupComponent,
  AuditLogTableComponent,
  AduitLogDetailsComponent,
  BankCodePopupComponent,
  ButtonLoadingComponent,
  CalendarHeaderComponent,
  ChartPage,
  CommonLevelStatusComponent,
  CreatedDurationModelComponent,
  CustomDrawerComponent,
  CustomPaginationComponent,
  CustomSuccessPopupComponent,
  IcActionButtonComponent,
  IcCustomAmountInput,
  IcCustomInputComponent,
  IcCustomPayFromComponent,
  IcRadioButtonComponent,
  IcRowInputComponent,
  IcToggleSlideComponent,
  InputDatePickerComponent,
  MaturityChartComponent,
  NewAuditlogButtonGroupComponent,
  NewReusableFilterComponent,
  NewReusableMatTableComponent,
  PopupSuccessComponent,
  QrcodeComponent,
  RecentTransactionComponent,
  ReusableFavouritiesComponent,
  ReusableNodatafoundComponent,
  ReusableTableComponent,
  SelectSingleTransferComponent,
  SwiperComponent,
  DashboardInstantPayComponent,
  ExternalLinkComponent,
  LinkPayeeSideBarComponent,
  TabLinkComponent,
  ToolbarTabComponent,
  ToolbarTitleComponent,
  TransactionCardComponent,
];
@NgModule({
  declarations: components,
  imports: [CommonModule],
  exports: components,
})
export class SharedCorporateBankingModule {}
