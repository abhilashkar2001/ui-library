import { HeaderModel } from 'app/shared/models/card.model';
import { TableHeader } from '../../dashboard/modules/cheque-book/cheque.store';
import { QuickLinkTabModel, TabModel } from 'app/shared/models/tab-model';

export class DebitCardStore {
  static readonly serviceTabs: TabModel[] = [
    {
      screenName: 'PIN Generation',
      route: '/user/card/debit-card/service/pin-generation',
      src: 'assets/images/pin-generation-blue.svg',
      selectedSrc: 'assets/images/pin-generation-white.svg',
      icon: 'pin-gen-icon',
      selectedIcon: 'selected-pin-gen-icon',
    },
    {
      screenName: 'Block Card',
      route: '/user/card/debit-card/service/block-card',
      src: 'assets/images/block-card-blue.svg',
      selectedSrc: 'assets/images/block-card-white.svg',
      icon: 'block-card-icon',
      selectedIcon: 'selected-block-card-icon',
    },

    {
      screenName: 'Upgrade',
      route: '/user/card/debit-card/service/upgrade',
      src: 'assets/images/upgrade-white.svg',
      selectedSrc: 'assets/images/upgrade-blue.svg',
      icon: 'upgrade-icon',
      selectedIcon: 'selected-upgrade-icon',
    },
  ];

  static readonly manageDebitCardTabs: TabModel[] = [
    {
      screenName: 'Card Control',
      route: '/user/card/debit-card/manage-card/card-control',
      src: 'assets/images/card-control-icon.svg',
      selectedSrc: 'assets/images/selected-card-control-icon.svg',
      icon: 'card-control-icon',
      selectedIcon: 'selected-card-control-icon',
    },
    {
      screenName: 'Usage Limit',
      route: '/user/card/debit-card/manage-card/card-usage',
      src: 'assets/images/selected-usage-limit-icon.svg',
      selectedSrc: 'assets/images/selected-usage-limit-icon.svg',
      icon: 'selected-usage-limit-icon',
      selectedIcon: 'selected-usage-limit-icon',
    },
  ];

  static readonly applyTabs: TabModel[] = [
    {
      screenName: 'Apply Card',
      route: '/card/credit-card/manage/card-control',
      src: 'assets/images/svg/card-icons/card-control-icon.svg',
      selectedSrc:
        'assets/images/svg/card-icons/selected-card-control-icon.svg',
      icon: 'card-control-icon',
      selectedIcon: 'selected-card-control-icon',
    },
    {
      screenName: 'Tracking',
      route: '/card/credit-card/manage/card-usage',
      src: 'assets/images/svg/card-icons/selected-usage-limit-icon.svg',
      selectedSrc: 'assets/images/svg/card-icons/selected-usage-limit-icon.svg',
      icon: 'usage-limit-icon',
      selectedIcon: 'selected-usage-limit-icon',
    },
  ];
  static readonly detailsItem: HeaderModel[] = [
    {
      key: 'accountNumber',
      label: 'Link Account No',
    },
    {
      key: 'customerName',
      label: 'Card Holder',
    },
    {
      key: 'status',
      label: 'International Travel',
    },
  ];
  static readonly recentTransTabs: string[] = ['Transaction'];
  static readonly recentTransColumn: TableHeader[] = [
    {
      headerDef: 'name',
      headerCell: 'Name',
    },
    {
      headerDef: 'accountNumber',
      headerCell: 'Account Number',
    },
    {
      headerDef: 'type',
      headerCell: 'Type',
    },
    {
      headerDef: 'refNo',
      headerCell: 'Ref Number',
    },
    {
      headerDef: 'amount',
      headerCell: 'Amount',
    },
    {
      headerDef: 'created',
      headerCell: 'Transaction Date',
    },
  ];

  static readonly quickLinks: QuickLinkTabModel[] = [
    {
      screenName: 'Service',
      childTab: this.serviceTabs,
    },
    {
      screenName: 'Manage Card',
      childTab: this.manageDebitCardTabs,
    },
  ];

  static readonly Links = [
    'Payment',
    'Convert to EMI',
    'Autopay',
    'Billing Cycle',
    'E Statement',
    'PIN Generation',
    'Block Card',
    'Change PIN',
    'Card EMI Details',
    'Pre Generated Statement',
    'Instant Loan',
    'Alert Subscription',
    'Add On Card',
    'Upgrade',
  ];
  static readonly DebitLinks = ['Block Card', 'PIN Generation', 'Upgrade'];
  static readonly ManageLinks = ['Card Control', 'Usage Limit'];

  static readonly unbilledHeader = [
    {
      headerDef: 'cbsRefNo',
      headerCell: 'Ref Number',
    },
    {
      headerDef: 'paymentType',
      headerCell: 'Details',
    },
    {
      headerDef: 'debitAmount',
      headerCell: 'Amount',
    },
    {
      headerDef: 'created',
      headerCell: 'Transaction Date',
    },
  ];
}
