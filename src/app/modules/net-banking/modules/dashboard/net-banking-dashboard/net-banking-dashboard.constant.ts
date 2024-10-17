export class NETBANKING {
  static readonly transferType = [
    {
      sequence: 1,
      label: "Quick Links",
      className: "quickLinks",
      types: [
        {
          label: "Own Account Transfer",
          image: "/assets/images/account-transfer.svg",
          route: "",
        },
        {
          label: "Fund Transfer",
          image: "/assets/images/fund-transfer.svg",
          route: "",
        },
        {
          label: "Issue Draft",
          image: "/assets/images/issue-draft.svg",
          route: "",
        },
        {
          label: "Adhoc Payment",
          image: "/assets/images/adhoc-payment.svg",
          route: "",
        },
        {
          label: "Cheque",
          image: "/assets/images/issue-draft.svg",
          route: "user/dashboard/cheque/home/chequebook-request",
        },
        {
          label: "Salary Account",
          image: "/assets/images/adhoc-payment.svg",
          route: "user/dashboard/salary-account",
        },
      ],
    },
    {
      sequence: 2,
      label: "Fund Transfer",
      className: "fundTransfer",
      types: [
        {
          label: "Bulk Upload",
          image: "/assets/images/bulk-upload.svg",
          route: "user/dashboard/fund-transfer/bulk-upload",
        },
        {
          label: "Single Transfer",
          image: "/assets/images/fund-transfer.svg",
          route: "user/dashboard/fund-transfer/fund-transfer-summary",
          type: "SINGLE",
        },
        {
          label: "Multi Transfer",
          image: "/assets/images/issue-draft.svg",
          route: "user/dashboard/fund-transfer/fund-transfer-summary",
          type: "MULTI",
        },
      ],
    },
    {
      sequence: 3,
      label: "Favorites",
      className: "favorites",
    },
  ];
  static readonly dummyHeader = [
    {
      columnDef: "refNo",
      header: "Ref No",
      cell: (element: any) => `${element.Id}`,
    },
    {
      columnDef: "productType",
      header: "Product Type",
      cell: (element: any) => `${element.name}`,
    },

    {
      columnDef: "dateTime",
      header: "Date & Time",
      cell: (element: any) => `${element.lastUpdated}`,
    },

    {
      columnDef: "amount",
      header: "Amount",
      cell: (element: any) => `${element.authStatus}`,
    },
    {
      columnDef: "initiatedBy",
      header: "Initiated By",
      cell: (element: any) => `${element.recordStatus}`,
    },
  ];
  static readonly colorCode = [
    {
      label: "account",
      valColor: "#0089FF",
      bgColor: "#EBF6FF",
    },
    {
      label: "nonAccount",
      valColor: "#D68C00",
      bgColor: "#FFF7E3",
    },
    {
      label: "payments",
      valColor: "#B20000",
      bgColor: "#FFE6E6",
    },
    {
      label: "billPayments",
      valColor: "#008461",
      bgColor: "#EBFFFA",
    },
    {
      label: "bulkFile",
      valColor: "#004C97",
      bgColor: "#E1ECF7",
    },
    {
      label: "bulkRecords",
      valColor: "#3A00D6",
      bgColor: "#E4E3FF",
    },
  ];
  static readonly navigationItems = [
    {
      label: "Home",
      icon: "/assets/images/home_icon.svg",
      link: "/user/dashboard",
    },
    {
      label: "Fund Transfer",
      icon: "/assets/images/net-banking-nav-bar/Fund-Transfer_Icon.svg",
    },
    {
      label: "Trade on Net",
      icon: "/assets/images/trade_icon.svg",
      link: "/user/trade/dashboard",
    },
    {
      label: "Deposit",
      icon: "/assets/images/net-banking-nav-bar/Deposit_Icon.svg",
    },
    {
      label: "Cards",
      icon: "/assets/images/net-banking-nav-bar/Cards_Icon.svg",
    },
    {
      label: "Loan",
      icon: "/assets/images/net-banking-nav-bar/Loan_Icon.svg",
      link: "/user/loan/dashboard"
    },
    {
      label: "Summary",
      icon: "/assets/images/net-banking-nav-bar/Summary_Icon.svg",
    },
  ];

  static readonly PENDING_SUMMARY = [
    {
      columnDef: "transactionReferenceNo",
      header: "Ref Number",
      cell: (element: any) => element.transactionReferenceNo,
    },
    {
      columnDef: "debitAccount",
      header: "Source Account",
      cell: (element: any) => element.corpFundDetails?.[0]?.debitAccount,
    },
    {
      columnDef: "creditAccount",
      header: "Destination Account",
      cell: (element: any) => element.corpFundDetails?.[0]?.creditAccount,
    },
    {
      columnDef: "cbsRefNo",
      header: "External Ref No",
      cell: (element: any) => element.corpFundDetails?.[0]?.cbsRefNo,
    },
    {
      columnDef: "beneficiaryName",
      header: "Beneficiary Name",
      cell: (element: any) => element.corpFundDetails?.[0]?.beneficiaryName,
    },
    {
      columnDef: "transferMode",
      header: "Transfer Mode",
      cell: (element: any) => element.corpFundDetails?.[0]?.transferMode,
    },
    {
      columnDef: "debitAmount",
      header: "Amount",
      cell: (element: any) => element.corpFundDetails?.[0]?.debitAmount,
    },
  ];
}
