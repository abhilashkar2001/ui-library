export class ChequeStore {
  static readonly tabScreens: any[] = [
    {
      screenName: "Cheque Book Request",
      route: "user/dashboard/cheque/home/chequebook-request",
      src: "assets/images/send-money-abroad.svg",
      icon: "send-money-abroad",
      selectedSrc: "assets/images/selected-money-abroad.svg",
      selectedIcon: "selected-money-abroad.svg",
    },
    {
      screenName: "Cheque Status Inquiry",
      route: "user/dashboard/cheque/home/cheque-status-enquiry",
      src: "assets/images/send-money-abroad.svg",
      icon: "send-money-abroad",
      selectedSrc: "assets/images/selected-money-abroad.svg",
      selectedIcon: "selected-money-abroad.svg",
    },
    {
      screenName: "Stop Cheque",
      route: "user/dashboard/cheque/home/stop-cheque",
      src: "assets/images/send-money-abroad.svg",
      icon: "send-money-abroad",
      selectedSrc: "assets/images/selected-money-abroad.svg",
      selectedIcon: "selected-money-abroad.svg",
    },
  ];

  static readonly recentColumns: TableHeader[] = [
    {
      headerDef: "chequeNumber",
      headerCell: "Cheque Number",
    },
    {
      headerDef: "status",
      headerCell: "Status",
    },
    {
      headerDef: "reason",
      headerCell: "Reason",
    },
    {
      headerDef: "amount",
      headerCell: "Amount",
    },
  ];
}

export interface TableHeader {
  headerDef: string;
  headerCell: string;
  cellKey?: string;
  optional?: boolean;
}
