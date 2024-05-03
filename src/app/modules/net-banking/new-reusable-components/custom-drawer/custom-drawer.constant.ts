export class DrawerConstant {
  static readonly DRAWER_MENU = [
    {
      name: "Transaction",
      path: "",
      roleName: "parent-node",
      children: [
        {
          name: "BG Issuance",
          path: "",
          roleName: "child-node",
          children: [
            {
              name: "BG Issuance",
              path: "bgSummary",
              id: "BG Issuance",
              summaryUrl: "bgIssuance/fetchApplicantInfo",
            },
            { name: "BG Amendment", path: "bgSummary", id: "BG Amendment" },
            {
              name: "BG Physical Amedment",
              path: "bgSummary",
              id: "BG Physical",
            },
            {
              name: "BG Templates",
              path: "bgSummary",
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
              path: "bgSummary",
              id: "BG Issuance",
              summaryUrl: "bgIssuance/fetchApplicantInfo",
            },
            { name: "LC Amendment", path: "bgSummary", id: "LC Amendment" },
            {
              name: "Draft LC Issuance",
              path: "bgSummary",
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
        { name: "REMITTANCE",
         path: "remittance-summery", 
         roleName: "child-node"
         },
        { name: "BILL PROCESSING", 
          path: "",
         roleName: "child-node",
         children: [
          {
            name: "Document Acceptance",
            path: "bill-processing",
            id: "BG Issuance",
          },
          {
            name: "Payment Request Enquirey",
            path: "bill-processing",
            id: "LC Physical Amendment",
          },
        ],
         },
        { name: "EXPORTS PROCESSING", path: "", roleName: "child-node" },
        { name: "BUYERS CREDIT", path: "buyer-credit-summery", roleName: "child-node" },
        { name: "EXPORT BILL DISPATCH", path: "", roleName: "child-node" },
        { name: "Export SW Bill", path: "ExportSWBillLodgementSummary", roleName: "child-node" },
        { name: "EEFC", path: "", roleName: "child-node" },
      ],
    },
    {
      name: "Beneficiary Maintenance",
      path: "beneficiary",
      roleName: "parent-node",
    },
  ];
}
