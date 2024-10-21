export class SendMoneyStore {
  static readonly tabScreens: ScreenRoute[] = [
    {
      screenName: "Transfer Money",
      route: "/user/send-money/dashboard/transfer-money",
      src: "assets/images/self-transfer-blue.svg",
      selectedSrc: "assets/images/self-transfer.svg",
      icon: "ib-send-money",
      selectedIcon: "seleced-transfer-money-icon",
    },
    {
      screenName: "Self Transfer",
      route: "/user/send-money/dashboard/self-transfer",
      src: "assets/images/self-transfer-blue.svg",
      selectedSrc: "assets/images/self-transfer.svg",
      icon: "self-transfer-icon",
      selectedIcon: "seleced-transfer-icon",
    },
    {
      screenName: "Schedule Payment",
      route: "/user/send-money/dashboard/schedule-payment",
      src: "assets/images/schedule-payment.svg",
      selectedSrc: "assets/images/selected-schedule-payment.svg",
      icon: "schedule-payment-icon",
      selectedIcon: "seleced-schedule-payment-icon",
    },
  ];

  static readonly recentTabs = [
    "Account",
    "Credit Card",
    "UPI",
    "MMID",
    "Abroad",
  ];

  static readonly recentColumns: TableHeader[] = [
    {
      headerDef: "beneficiaryName",
      headerCell: "Name",
    },
    {
      headerDef: "creditAccount",
      headerCell: "Source Acc",
    },
    {
      headerDef: "debitAccount",
      headerCell: "Destination Acc",
    },
    {
      headerDef: "accountType",
      headerCell: "Account Type",
    },
    {
      headerDef: "transferType",
      headerCell: "Transfer Type",
    },
    {
      headerDef: "creditAmount",
      headerCell: "Amount",
    },
    {
      headerDef: "created",
      headerCell: "Transaction Date",
    },
    {
      headerDef: "action",
      headerCell: "Action",
    },
  ];

  static readonly recentTransData = [
    {
      name: "Mr Champak Ray",
      accountNo: "437743738732847",
      type: "Saving Account",
      amount: "- ₹ 20,900",
      transactionDate: "10 Apr 2023",
      action: "Repay",
    },
    {
      name: "Mr Vijay",
      accountNo: "437743738732847",
      type: "Saving Account",
      amount: "+ ₹ 20,900",
      transactionDate: "10 Apr 2023",
      action: "Repay",
    },
    {
      name: "Mr Champak Ray",
      accountNo: "437743738732847",
      type: "Saving Account",
      amount: "- ₹ 20,900",
      transactionDate: "10 Apr 2023",
      action: "Repay",
    },
    {
      name: "Mr Vijay",
      accountNo: "437743738732847",
      type: "Saving Account",
      amount: "+ ₹ 20,900",
      transactionDate: "10 Apr 2023",
      action: "Repay",
    },
    {
      name: "Mr Champak Ray",
      accountNo: "437743738732847",
      type: "Saving Account",
      amount: "- ₹ 20,900",
      transactionDate: "10 Apr 2023",
      action: "Repay",
    },
    {
      name: "Mr Vijay",
      accountNo: "437743738732847",
      type: "Saving Account",
      amount: "+ ₹ 20,900",
      transactionDate: "10 Apr 2023",
      action: "Repay",
    },
  ];

  static readonly externalLinks = [
    "Invesments",
    "Credit Card",
    "Fixed Deposit",
    "Personal Banking",
    "Mobile Banking",
    "Corporate Banking",
    "Create Account",
    "Help & Support",
  ];

  static readonly externalDataLinks = [
    "E Statement",
    "Pre Generated Statement",
    "Nominee Details",
    "Demand Draft Request",
    "New Savings Account",
    "Interest Certificate",
    "Nominee Details",
    "Communication Address",
    "Update KYC",
    "Change Home Branch",
    "Update Signature",
    "Cheque Issued",
    "Unclear Transaction",
    "Lien Linked on Account",
  ];
}

export interface ScreenRoute {
  screenName: string;
  route: string;
  src: string;
  selectedSrc: string;
  icon: string;
  selectedIcon: string;
}

export interface TableHeader {
  headerDef: string;
  headerCell: string;
  cellKey?: string;
  optional?: boolean;
}
