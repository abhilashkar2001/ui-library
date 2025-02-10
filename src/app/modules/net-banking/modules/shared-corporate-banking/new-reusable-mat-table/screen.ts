export class SCREENLIST {
  static readonly listOfScreens = [
    { screenName: 'Inter Branch General Ledger Maintenance' },
    { screenName: 'Transfer Cash Maintenance' },
    { screenName: 'Buy/ Sell Cash from Central Bank/ Currency Chest' },
    { screenName: 'Transfer Cash from/ to Vault/ Till' },
    { screenName: 'Book Shortage Maintenance' },
    { screenName: 'Branch Cash Transfer Maintenance' },
    { screenName: 'Open Or Close Till / Vault' },
    { screenName: 'Security Policy' },
    { screenName: 'Instrument Maintenance' },
    { screenName: 'Instrument Status Maintenance' },
  ];

  static staticBreadCrump: any = [
    {
      title: '',
      path: 'teller/dashboard',
      breadcrumb: 'Home > Teller Opration >',
      params: {
        id: null,
        isEdit: false,
      },
    },
    {
      title: '',
      path: 'openCloseTillVault',
      breadcrumb: 'Open Or Close Till / Vault',
      params: {
        id: null,
        isEdit: false,
      },
    },
  ];
}
