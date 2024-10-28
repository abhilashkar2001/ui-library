import {
  Cards,
  CardTransactionModel,
  HeaderModel,
} from "app/shared/models/card.model";
import { TableHeader } from "../../dashboard/modules/cheque-book/cheque.store";
import { QuickLinkTabModel, TabModel } from "app/shared/models/tab-model";
import {
  ChartHeaderModel,
  tabScreenModel,
} from "app/shared/models/card-chart.model";

export class CreditCardStore {
  static readonly serviceTabs: TabModel[] = [
    // {
    //   screenName: "Card Dashboard",
    //   route: "/card/credit-card/dashboard",
    //   src: "assets/images/send-money-icon.svg",
    //   selectedSrc: "assets/images/send-money-unselected.svg",
    //   icon: "send-money-icon",
    //   selectedIcon: "send-money-unselected",
    // },
    {
      screenName: "Payment",
      route: "/user/card/credit-card/service/payment",
      src: "assets/images/card-payment-blue.svg",
      selectedSrc: "assets/images/card-payment-white.svg",
      icon: "card-payment-blue",
      selectedIcon: "card-payment-white",
    },
    {
      screenName: "Convert to EMI",
      route: "/user/card/credit-card/service/convert-to-emi",
      src: "assets/images/net-banking/loans/loan-repayment.svg",
      selectedSrc: "assets/images/selected-quick-transfer.svg",
      icon: "loan_repayment",
      selectedIcon: "selected-payment-icon",
    },
    // {
    //   screenName: "Card Summary",
    //   // route: "/card/credit-card/service/card-summary",
    //   src: "assets/images/card-summary-blue.svg",
    //   selectedSrc: "assets/images/card-summary-white.svg",
    //   icon: "card-summary-icon",
    //   selectedIcon: "selected-card-summary-icon",
    // },
    {
      screenName: "AutoPay",
      route: "/user/card/credit-card/service/autopay",
      src: "assets/images/auto-debit-blue.svg",
      selectedSrc: "assets/images/auto-debit-white.svg",
      icon: "autopay-icon",
      selectedIcon: "selected-autopay-icon",
    },
    {
      screenName: "Billing Cycle",
      route: "/user/card/credit-card/service/billing-cycle",
      src: "assets/images/billing-cycle-blue.svg",
      selectedSrc: "assets/images/billing-cycle-white.svg",
      icon: "bill-cycle-icon",
      selectedIcon: "selected-bill-cycle-icon",
    },
    {
      screenName: "E Statement",
      route: "/user/card/credit-card/service/e-statement",
      src: "assets/images/e-statment-blue.svg",
      selectedSrc: "assets/images/e-statment-white.svg",
      icon: "bill-cycle-icon",
      selectedIcon: "selected-bill-cycle-icon",
    },
    {
      screenName: "PIN Generation",
      route: "/user/card/credit-card/service/pin-generation",
      src: "assets/images/pin-generation-blue.svg",
      selectedSrc: "assets/images/pin-generation-white.svg",
      icon: "pin-gen-icon",
      selectedIcon: "selected-pin-gen-icon",
    },
    {
      screenName: "Block Card",
      route: "/user/card/credit-card/service/block-card",
      src: "assets/images/block-card-blue.svg",
      selectedSrc: "assets/images/block-card-white.svg",
      icon: "block-card-icon",
      selectedIcon: "selected-block-card-icon",
    },
    // {
    //   screenName: "Change PIN",
    //   route: "/user/card/credit-card/service/change-pin",
    //   src: "assets/images/change-pin-blue.svg",
    //   selectedSrc: "assets/images/change-pin-white.svg",
    //   icon: "change-pin-icon",
    //   selectedIcon: "selected-change-pin-icon",
    //   skipActionButton: true,
    // },
    {
      screenName: "Card EMI Details",
      route: "/user/card/credit-card/service/card-emi-details",
      src: "assets/images/emi-details-blue.svg",
      selectedSrc: "assets/images/emi-details-white.svg",
      icon: "emi-details-icon",
      selectedIcon: "selected-emi-details-icon",
    },
    {
      screenName: "Insta Loan",
      route: "/user/card/credit-card/service/instant-loan",
      src: "assets/images/insta-loan-blue.svg",
      selectedSrc: "assets/images/insta-loan-white.svg",
      icon: "insta-loan-icon",
      selectedIcon: "selected-insta-loan-icon",
    },
    {
      screenName: "Alert Subscription",
      route: "/user/card/credit-card/service/alert-subscription",
      src: "assets/images/alert-sub-blue.svg",
      selectedSrc: "assets/images/alert-sub-white.svg",
      icon: "alert-subsc-icon",
      selectedIcon: "selected-alert-subsc-icon",
    },
    {
      screenName: "Unbilled Transaction",
      route: "/user/card/credit-card/service/unbilled-transaction",
      src: "assets/images/unbilled-transcation-blue.svg",
      selectedSrc: "assets/images/unbilled-transcation-white.svg",
      icon: "unbill-trans-icon",
      selectedIcon: "selected-unbill-trans-icon",
    },
    {
      screenName: "Add On Card",
      route: "/user/card/credit-card/service/add-on-card",
      src: "assets/images/addcard-blue.svg",
      selectedSrc: "assets/images/addcard-white.svg",
      icon: "add-card-icon",
      selectedIcon: "selected-add-card-icon",
    },
    {
      screenName: "Upgrade",
      route: "/user/card/credit-card/service/upgrade",
      src: "assets/images/upgrade-white.svg",
      selectedSrc: "assets/images/upgrade-blue.svg",
      icon: "upgrade-icon",
      selectedIcon: "selected-upgrade-icon",
    },
    // {
    //   screenName: "Pre Generated Statement",
    //   route: "/user/card/credit-card/service/pre-generated-statement",
    //   src: "assets/images/pre-generated-blue.svg",
    //   selectedSrc: "assets/images/pre-generated-white.svg",
    //   icon: "payment-icon",
    //   selectedIcon: "selected-payment-icon",
    // },
  ];
  static readonly manageCardTabs: TabModel[] = [
    {
      screenName: "Card Control",
      route: "/user/card/credit-card/manage-card/card-control",
      src: "assets/images/card-control-icon.svg",
      selectedSrc: "assets/images/selected-card-control-icon.svg",
      icon: "card-control-icon",
      selectedIcon: "selected-card-control-icon",
    },
    {
      screenName: "Usage Limit",
      route: "/user/card/credit-card/manage-card/card-usage",
      src: "assets/images/selected-usage-limit-icon.svg",
      selectedSrc: "assets/images/selected-usage-limit-icon.svg",
      icon: "selected-usage-limit-icon",
      selectedIcon: "selected-usage-limit-icon",
    },
  ];

  static readonly applyTabs: TabModel[] = [
    {
      screenName: "Apply Card",
      route: "/card/credit-card/manage/card-control",
      src: "assets/images/svg/card-icons/card-control-icon.svg",
      selectedSrc:
        "assets/images/svg/card-icons/selected-card-control-icon.svg",
      icon: "card-control-icon",
      selectedIcon: "selected-card-control-icon",
    },
    {
      screenName: "Tracking",
      route: "/card/credit-card/manage/card-usage",
      src: "assets/images/svg/card-icons/selected-usage-limit-icon.svg",
      selectedSrc: "assets/images/svg/card-icons/selected-usage-limit-icon.svg",
      icon: "usage-limit-icon",
      selectedIcon: "selected-usage-limit-icon",
    },
  ];
  static readonly cardList: Cards = [
    {
      cardName: "Moneyback Plus Visa",
      expiryDate: "4689 **** **** 6321 ",
      cardNumber: "10 Apr 2021",
      fileUrl: "assets/images/card_img1.png",
      cashLimit: "₹ 1,43,103",
      statementDate: "20 Apr 2024",
      lastPaymentDate: "09 Apr 20240",
      totalCreditLimit: "₹ 8,00,000",
      totalDueAmount: "₹ 6,55,151",
      accountCurrency: "INR",
      rewardPoint: 2150,
      dueDate: "Due on 6 June 2024",
      cardStatus: "",
      id: 0,
      bankName: "",
      customerName: "",
      validDate: "",
      typeOfCard: "",
      autoPay: false,
      currentOutStaning: 0,
      avlCreditBalance: 0,
      lastStlmtMade: 0,
      accountNumber: "",
      customerId: 0,
      status: "Active",
      cvv: 876,
      cardType: "Credit Card",
      joiningFee: 999,
      annualFee: 499,
      benefits: [
        "Tata CliQ voucher worth ₹ 3,000",
        "EaseMyTrip vouchers worth ₹ 4,000 (Four vouchers worth ₹ 1,000 each)",
        "Uber vouchers worth ₹ 1,000 (Four vouchers worth ₹ 250 each)",
        "Croma voucher worth ₹ 1,500",
      ],
    },
    {
      cardName: "Sapphiro Credit Card",
      expiryDate: "4689 **** **** 6386 ",
      cardNumber: "5 Apr 20231",
      fileUrl: "assets/images/credit-card-green.png",
      cashLimit: "₹ 1,43,103",
      statementDate: "20 Apr 2024",
      lastPaymentDate: "09 Apr 20240",
      totalCreditLimit: "₹ 8,00,000",
      totalDueAmount: "",
      accountCurrency: "",
      rewardPoint: 0,
      dueDate: 0,
      cardStatus: "",
      id: 0,
      bankName: "",
      customerName: "",
      validDate: "",
      typeOfCard: "",
      autoPay: false,
      currentOutStaning: 0,
      avlCreditBalance: 0,
      lastStlmtMade: 0,
      accountNumber: "",
      customerId: 0,
      status: "Active",
      cvv: 876,
      cardType: "Credit Card",
      joiningFee: 699,
      annualFee: 499,
      benefits: [
        "Tata CliQ voucher worth ₹ 3,000",
        "EaseMyTrip vouchers worth ₹ 4,000 (Four vouchers worth ₹ 1,000 each)",
        "Uber vouchers worth ₹ 1,000 (Four vouchers worth ₹ 250 each)",
        "Croma voucher worth ₹ 1,500",
      ],
    },
    {
      cardName: "Moneyback Plus Visa",
      expiryDate: "4689 **** **** 6327",
      cardNumber: "4th Apr 20228",
      fileUrl: "assets/images/credit-card-red.png",
      cashLimit: "₹ 1,43,103",
      statementDate: "20 Apr 2024",
      lastPaymentDate: "09 Apr 20240",
      totalCreditLimit: "₹ 8,00,000",
      totalDueAmount: "",
      accountCurrency: "",
      rewardPoint: 0,
      dueDate: 0,
      cardStatus: "",
      id: 0,
      bankName: "",
      customerName: "",
      validDate: "",
      typeOfCard: "",
      autoPay: false,
      currentOutStaning: 0,
      avlCreditBalance: 0,
      lastStlmtMade: 0,
      accountNumber: "",
      customerId: 0,
      status: "Active",
      cvv: 123,
      joiningFee: 999,
      annualFee: 399,
      benefits: [
        "Tata CliQ voucher worth ₹ 3,000",
        "EaseMyTrip vouchers worth ₹ 4,000 (Four vouchers worth ₹ 1,000 each)",
        "Uber vouchers worth ₹ 1,000 (Four vouchers worth ₹ 250 each)",
        "Croma voucher worth ₹ 1,500",
      ],
    },
    {
      cardName: "Moneyback Plus Visa",
      expiryDate: "4689 **** **** 6321 ",
      cardNumber: "10 Apr 2021",
      fileUrl: "assets/images/credit-card-red.png",
      cashLimit: "₹ 1,43,103",
      statementDate: "20 Apr 2024",
      lastPaymentDate: "09 Apr 20240",
      totalCreditLimit: "₹ 8,00,000",
      totalDueAmount: "",
      accountCurrency: "",
      rewardPoint: 0,
      dueDate: 0,
      cardStatus: "",
      id: 0,
      bankName: "",
      customerName: "",
      validDate: "",
      typeOfCard: "",
      autoPay: false,
      currentOutStaning: 0,
      avlCreditBalance: 0,
      lastStlmtMade: 0,
      accountNumber: "",
      customerId: 0,
      status: "Active",
      cvv: 876,
      cardType: "Credit Card",
      joiningFee: 999,
      annualFee: 499,
      benefits: [
        "Tata CliQ voucher worth ₹ 3,000",
        "EaseMyTrip vouchers worth ₹ 4,000 (Four vouchers worth ₹ 1,000 each)",
        "Uber vouchers worth ₹ 1,000 (Four vouchers worth ₹ 250 each)",
        "Croma voucher worth ₹ 1,500",
      ],
    },
    {
      cardName: "Moneyback Plus Visa",
      expiryDate: "4689 **** **** 6321 ",
      cardNumber: "10 Apr 2021",
      fileUrl: "assets/images/credit-card-red.png",
      cashLimit: "₹ 1,43,103",
      statementDate: "20 Apr 2024",
      lastPaymentDate: "09 Apr 20240",
      totalCreditLimit: "₹ 8,00,000",
      totalDueAmount: "",
      accountCurrency: "",
      rewardPoint: 0,
      dueDate: 0,
      cardStatus: "",
      id: 0,
      bankName: "",
      customerName: "",
      validDate: "",
      typeOfCard: "",
      autoPay: false,
      currentOutStaning: 0,
      avlCreditBalance: 0,
      lastStlmtMade: 0,
      accountNumber: "",
      customerId: 0,
      status: "Active",
      cvv: 876,
      cardType: "Credit Card",
      joiningFee: 999,
      annualFee: 499,
      benefits: [
        "Tata CliQ voucher worth ₹ 3,000",
        "EaseMyTrip vouchers worth ₹ 4,000 (Four vouchers worth ₹ 1,000 each)",
        "Uber vouchers worth ₹ 1,000 (Four vouchers worth ₹ 250 each)",
        "Croma voucher worth ₹ 1,500",
      ],
    },
  ];
  static readonly detailsItem: HeaderModel[] = [
    {
      key: "currentOutStaning",
      label: "Current Outstanding",
      actionItem: () => "Convert to EMI",
    },
    {
      key: "avlCreditBalance",
      label: "Available Credit Limit",
      actionKey: "cashLimit",
      actionItem: (cashLimit: string) => `* Includes Cash limit ${cashLimit}`,
    },
    {
      key: "totalCreditLimit",
      label: "Total Credit Limit",
      actionItem: () => "Increase",
    },
    {
      key: "statementDate",
      label: "Statement Date",
    },
    {
      key: "lastStlmtMade",
      label: "Last Statement Made",
    },
    {
      key: "lastPaymentDate",
      label: "Last Payment Date",
    },
  ];
  static readonly recentTransTabs: string[] = ["Unbilled Transaction"];
  static readonly recentTransColumn: TableHeader[] = [
    {
      headerDef: "cbsRefNo",
      headerCell: "Ref Number",
    },
    {
      headerDef: "transferType",
      headerCell: "Details",
    },
    {
      headerDef: "debitAmount",
      headerCell: "Amount",
    },
    {
      headerDef: "created",
      headerCell: "Transaction Date",
    },
  ];

  static readonly recentTransData: CardTransactionModel[] = [
    {
      date: "24 Apr",
      refNumber: "437743738732847",
      details: "UPI CC-24042024-411504615701",
      amount: "- ₹ 20,900",
      points: 60,
      transactionDate: "10 Apr 2023",
    },
    {
      date: "28 Apr",
      refNumber: "437743738732847",
      details: "UPI CC-24042024-411504615701",
      amount: "- ₹ 10,500",
      points: 30,
      transactionDate: "10 Apr 2024",
    },
  ];
  static readonly quickLinks: QuickLinkTabModel[] = [
    {
      screenName: "Service",
      childTab: this.serviceTabs,
    },
    {
      screenName: "Manage Card",
      childTab: this.manageCardTabs,
    },
    {
      screenName: "Apply",
      childTab: this.applyTabs,
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
  static readonly Links = [
    "Payment",
    "Convert to EMI",
    "Autopay",
    "Billing Cycle",
    "E Statement",
    "PIN Generation",
    "Block Card",
    "Change PIN",
    "Card EMI Details",
    "Pre Generated Statement",
    "Instant Loan",
    "Alert Subscription",
    "Add On Card",
    "Upgrade",
  ];
  static readonly ManageLinks = ["Card Control", "Usage Limit"];

  static readonly billCycleList = [
    { value: 1, label: "1st  each month" },
    { value: 2, label: "2nd  each month" },
    { value: 3, label: "3rd  each month" },
    { value: 5, label: "5th  each month" },
    { value: 10, label: "10th  each month" },
    { value: 12, label: "12th  each month" },
    { value: 15, label: "15th  each month" },
    { value: 18, label: "18th  each month" },
    { value: 21, label: "21st  each month" },
    { value: 23, label: "23rd  each month" },
    { value: 25, label: "25th  each month" },
    { value: 26, label: "26th  each month" },
  ];
  static readonly alertData: HeaderModel[] = [
    {
      key: "customerName",
      label: "Name on Card",
    },
    {
      key: "mobile",
      label: "Mobile Number",
    },
    {
      key: "email",
      label: "Email Id",
    },
  ];
  static readonly relationShipDetail = [
    { value: "Monther", label: "Mother" },
    { value: "Father", label: "Father" },
    { value: "Brother", label: "Brother" },
    { value: "Sister", label: "Sister" },
  ];
  static readonly creditEmiHeader = [
    {
      headerDef: "merchantNameOnCard",
      headerCell: "Merchant Name",
    },
    {
      headerDef: "amount",
      headerCell: "Loan Amount",
    },
    {
      headerDef: "tenure",
      headerCell: "Tenure",
    },
    {
      headerDef: "currentOutStaning",
      headerCell: "Outstanding Amount",
    },
    {
      headerDef: "monthlyEmi",
      headerCell: "Monthly EMI",
    },
    {
      headerDef: "interestRate",
      headerCell: "Interest Rate",
    },
    {
      headerDef: "pendingEmi",
      headerCell: "Pending EMI",
    },
    {
      headerDef: "startDate",
      headerCell: "Start Date",
    },
    {
      headerDef: "endDate",
      headerCell: "End Date",
    },
    {
      headerDef: "status",
      headerCell: "Status",
    },
  ];
  static readonly unbilledHeader = [
    {
      headerDef: "cbsRefNo",
      headerCell: "Ref Number",
    },
    {
      headerDef: "paymentType",
      headerCell: "Details",
    },
    {
      headerDef: "debitAmount",
      headerCell: "Amount",
    },
    {
      headerDef: "created",
      headerCell: "Transaction Date",
    },
  ];
  static readonly tabScreens: tabScreenModel[] = [
    {
      screenName: "RD Calculator",
      route: "/rd-calculator",
    },
    {
      screenName: "FD Calculator",
      route: "/fd-calculator",
    },
    {
      screenName: "Top UP",
      route: "/top-up",
    },
  ];

  static readonly chartData = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
    },
    title: {
      text: "FD/RD Calculator",
      align: "left",
    },
    xAxis: {
      categories: [],
    },
    yAxis: {
      min: 0,
      title: {
        text: "",
      },
      labels: {
        enabled: false,
      },
      gridLineWidth: 0,
    },
    tooltip: {
      pointFormat:
        '<span style="color:#00205c"><b>{series.name}</b></span>' +
        ": <b>{point.percentage:.0f}%</b>&nbsp;",
      shared: true,
    },
    plotOptions: {
      column: {
        borderRadius: "12px",
        shadow: {
          offsetX: 0,
          offsetY: 0,
          opacity: 0.01,
          width: 10,
        },
        stacking: "normal",
        dataLabels: {
          enabled: false,
          format: "{point.percentage:.0f}%",
        },
      },
    },
    series: [],
  };

  static readonly TopUpChart: ChartHeaderModel[] = [
    {
      headerCell: "Top Up",
      headerDef: "₹ 20,090",
    },
    {
      headerCell: "Interest Rate",
      headerDef: "7.10% p.a",
    },
    {
      headerCell: "Interest Amount",
      headerDef: "₹ 20,000",
    },
    {
      headerCell: "Maturity Date",
      headerDef: "02 Aug 2025",
    },
  ];

  static readonly TopUpDeposite: ChartHeaderModel[] = [
    {
      headerCell: "Top Up",
      headerDef: "topUpAmount",
    },
    {
      headerCell: "Interest Rate",
      headerDef: "intrestRate",
    },
    {
      headerCell: "Interest Amount",
      headerDef: "intrestAmount",
    },
    {
      headerCell: "Maturity Date",
      headerDef: "maturityDate",
    },
  ];

  static readonly FdRdChart: ChartHeaderModel[] = [
    {
      headerCell: "Interest Rate",
      headerDef: "intrestRate",
    },
    {
      headerCell: "Interest Amount",
      headerDef: "intrestAmount",
    },
    {
      headerCell: "Maturity Date",
      headerDef: "maturityDate",
    },
  ];
  static readonly instaChart: ChartHeaderModel[] = [
    {
      headerCell: "Interest Rate",
      headerDef: "intrestRate",
    },
    {
      headerCell: "Interest Amount",
      headerDef: "intrestAmount",
    },
    {
      headerCell: "Monthly EMI",
      headerDef: "monthlyEmi",
    },
  ];
}
