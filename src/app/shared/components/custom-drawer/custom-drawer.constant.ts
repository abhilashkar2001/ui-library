export class DrawerConstant {
  static readonly DRAWER_MENU = [
    {
      name: "Transaction",
      path: "",
      roleName: "parent-node",
      children: [
        {
          name: "BANK GUARANTEE",
          path: "",
          roleName: "child-node",
          children: [
            {
              name: "BG Issuance",
              path: "trade/bank-gurantee",
              id: "BG Issuance",
              summaryUrl: "bgIssuance/fetchApplicantInfo",
            },
            { name: "BG Amendment", path: "bank-gurantee", id: "BG Amendment" },
            {
              name: "BG Physical Amedment",
              path: "trade/bank-gurantee",
              id: "BG Physical",
            },
            {
              name: "BG Templates",
              path: "trade/bank-gurantee",
              id: "BG Templates",
            },
          ],
        },
        {
          name: "LETTER OF CREDIT",
          path: "",
          roleName: "child-node",
          children: [
            {
              name: "LC Issuance",
              path: "trade/bgSummary",
              id: "BG Issuance",
              summaryUrl: "bgIssuance/fetchApplicantInfo",
            },
            { name: "LC Amendment", path: "bgSummary", id: "LC Amendment" },
            {
              name: "Draft LC Issuance",
              path: "trade/bgSummary",
              id: "Draft LC Issuance",
            },
            {
              name: "LC Physical Amendment",
              path: "bgSummary",
              id: "LC Physical Amendment",
            },
            {
              name: "LC Template",
              path: "bgSummary",
              id: "LC Template",
            },
          ],
        },
        {
          name: "REMITTANCE",
          path: "remittance-summery",
          roleName: "child-node",
        },
        {
          name: "BILL PROCESSING",
          path: "",
          roleName: "child-node",
          children: [
            {
              name: "Document Acceptance",
              path: "bill-processing",
              id: "BG Issuance",
            },
            {
              name: "Payment Request Enquiry",
              path: "bill-processing",
              id: "LC Physical Amendment",
            },
          ],
        },
        {
          name: "EXPORTS PROCESSING",
          path: "",
          roleName: "child-node",
          children: [
            {
              name: "Pre-shipment Loan Process",
              path: "export-process-summery",
              id: "Pre-shipment Loan Process",
              summaryUrl: "",
            },
          ],
        },
        {
          name: "BUYERS CREDIT",
          path: "buyer-credit-summery",
          roleName: "child-node",
        },
        {
          name: "EXPORT BILL DISPATCH",
          path: "export-bill-dispatch-summary",
          roleName: "child-node",
        },
        {
          name: "Export SW Bill Lodgement",
          path: "ExportSWBillLodgementSummary",
          roleName: "child-node",
        },
        { name: "EEFC", path: "eefc-summary", roleName: "child-node" },
      ],
    },
    {
      name: "Beneficiary Maintenance",
      path: "beneficiary",
      roleName: "parent-node",
    },
  ];

  static readonly LOAN_DRAWER_MENU = [
    {
      name: "Loan Services",
      path: "",
      roleName: "parent-node",
      children: [
        {
          name: "LOAN REPAYMENT",
          path: "loan/loan-service/loan-repayment",
          roleName: "child-node",
        },
        {
          name: "TOPUP LOAN",
          path: "loan/loan-service/loan-topUP",
          roleName: "child-node",
        },
        {
          name: "MODIFY TENURE",
          path: "loan/loan-service/modify-tenure",
          roleName: "child-node",
        },
        {
          name: "REPAYMENT CYCLE",
          path: "loan/loan-service/repayment-cycle",
          roleName: "child-node",
        },
        {
          name: "DISBURSTMENT SCHEDULE",
          path: "loan/loan-service/disbursement-schedule",
          roleName: "child-node",
        },
        {
          name: "E-STATEMENT",
          path: "loan/loan-service/e-statement",
          roleName: "child-node",
        },
        {
          name: "VIEW STATEMENT",
          path: "loan/loan-service/view-statement",
          roleName: "child-node",
        },
        {
          name: "DISBURSTMENT REQUEST",
          path: "loan/loan-service/disbursement-request",
          roleName: "child-node",
        },
        {
          name: "REPAYMENT SCHEDULE",
          path: "loan/loan-service/repayment-schedule",
          roleName: "child-node",
        },
        {
          name: "PRE-GENERATED STATEMENT",
          path: "loan/loan-service/pre-generated-statement",
          roleName: "child-node",
        },
        {
          name: "GOLD RENEWAL",
          path: "loan/loan-service/gold-renewal",
          roleName: "child-node",
        },
        {
          name: "REQUEST CERTIFICATE",
          path: "loan/loan-service/request-certificate",
          roleName: "child-node",
        },
        {
          name: "INTERSET STATEMENT",
          path: "loan/loan-service/interest-statement",
          roleName: "child-node",
        },
      ],
    },

  ];


}
