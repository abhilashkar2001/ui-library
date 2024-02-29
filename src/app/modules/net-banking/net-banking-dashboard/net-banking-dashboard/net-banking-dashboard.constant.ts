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
          route: "user/dashboard/bulk-upload",
        },
        {
          label: "Single Transfer",
          image: "/assets/images/fund-transfer.svg",
          route: "",
        },
        {
          label: "Multi Transfer",
          image: "/assets/images/issue-draft.svg",
          route: "",
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
      icon: "/assets/images/net-banking-nav-bar/Home_Icon.svg",
      link: "/home",
    },
    {
      label: "Fund Transfer",
      icon: "/assets/images/net-banking-nav-bar/Fund-Transfer_Icon.svg",
      link: "/fund-transfer",
    },
    {
      label: "Deposit",
      icon: "/assets/images/net-banking-nav-bar/Deposit_Icon.svg",
      link: "/deposit",
    },
    {
      label: "Cards",
      icon: "/assets/images/net-banking-nav-bar/Cards_Icon.svg",
      link: "/cards",
    },
    {
      label: "Loan",
      icon: "/assets/images/net-banking-nav-bar/Loan_Icon.svg",
      link: "/loan",
    },
    {
      label: "Summary",
      icon: "/assets/images/net-banking-nav-bar/Summary_Icon.svg",
      link: "/summary",
    },
  ];

  static readonly dummyResponse = [
    {
      refNo: "4578",
      productType: "Salary",
      dateAndTime: "3 Apr 2022 | 14: 11",
      Amount: "$2,24,234",
      InitiatedBy: "hari",
      cifNumber: "876543",
    },
    {
      refNo: "4578",
      productType: "Salary",
      dateAndTime: "3 Apr 2022 | 14: 11",
      Amount: "$2,24,234",
      InitiatedBy: "hari",
      cifNumber: "876543",
    },
    {
      refNo: "4578",
      productType: "Salary",
      dateAndTime: "3 Apr 2022 | 14: 11",
      Amount: "$2,24,234",
      InitiatedBy: "hari",
      cifNumber: "876543",
    },
  ];
}
