export class bgConstant {
  static readonly bgStaticData = [
    {
      name: 1,
      invoiceNo: 8765,
      submitted: "manisha",
      billId: 36776,
      lastUpdatedBy: "xyz",
      dueDate: "09-03-2024",
      transStatus: "Pending",
      requestAssignedTo: "jghg",
      audit: "Unapproved",
    },
    {
      name: 2,
      invoiceNo: 765,
      submitted: "ngfd",
      billId: 4554,
      lastUpdatedBy: "xyz",
      dueDate: "09-03-2024",
      transStatus: "Completed",
      requestAssignedTo: "jghg",
      audit: "Approved",
    },
  ];

  static readonly templateStaticData = [
    {
      name: 1,
      templateName: "jgfgdf",
      submitted: "manisha",
      billId: 36776,
      lastUpdatedBy: "xyz",
      requestAssignedTo: "jghg",
    },
    {
      name: 1,
      templateName: "jgfgdf",
      submitted: "manisha",
      billId: 36776,
      lastUpdatedBy: "xyz",
      requestAssignedTo: "jghg",
    },
  ];

  static readonly ADDNEW_LIST = [
    {
      name: "Select Template",
      value: "template",
    },
    {
      name: "Create New",
      value: "new",
    },
  ];
}

export const summaryHelper = [
  {
    name: "BG Issuance",
    backPath: "user/trade/dashboard",
    summaryUrl: "bankGuarantee/fetchBgMaster?",
    addNewPath: "user/trade/bank-gurantee/add",
    columnRefName: "BGTYPE_SUMMARY",
  },
  {
    name: "BG Amendment",
    backPath: "user/trade/dashboard",
    summaryUrl: "bankGuarantee/fetchBgMaster?",
    addNewPath: "user/dashboard/trade/genericBg",
    columnRefName: "BGTYPE_SUMMARY",
  },
  {
    name: "BG Physical Amedment",
    backPath: "user/trade/dashboard",
    summaryUrl: "bankGuarantee/fetchBgMaster?",
    addNewPath: "user/dashboard/trade/genericBg",
    columnRefName: "BGTYPE_SUMMARY",
  },
  {
    name: "BG Issuance Templates",
    backPath: "user/trade/dashboard",
    summaryUrl: "bankGuarantee/fetchBgMaster?",
    addNewPath: "user/dashboard/trade/genericBg",
    columnRefName: "BGTYPE_SUMMARY",
  },
  {
    name: "LC Issuance",
    backPath: "user/trade/dashboard",
    summaryUrl: "lcMaster?lcType=Issuance&",
    addNewPath: "user/dashboard/trade/genericBg",
    columnRefName: "LC_SUMMARY",
  },
  {
    name: "LC Amendment",
    backPath: "user/trade/dashboard",
    summaryUrl: "lcMaster?lcType=Amendment&",
    addNewPath: "user/dashboard/trade/genericBg",
    columnRefName: "LC_SUMMARY",
  },
  {
    name: "Draft LC Issuance",
    backPath: "user/trade/dashboard",
    summaryUrl: "lcMaster?lcType=Draft&",
    addNewPath: "user/dashboard/trade/genericBg",
    columnRefName: "LC_SUMMARY",
  },
  {
    name: "LC Physical Amendment",
    backPath: "user/trade/dashboard",
    summaryUrl: "lcMaster?lcType=Physical Amendment&",
    addNewPath: "user/dashboard/trade/genericBg",
    columnRefName: "LC_SUMMARY",
  },
  {
    name: "LC Template",
    backPath: "user/trade/dashboard",
    summaryUrl: "lcMaster?lcType=Issuance&",
    addNewPath: "user/dashboard/trade/genericBg",
    columnRefName: "BGTEMPLATE_SUMMARY",
  },
  {
    name: "Remittance",
    backPath: "user/trade/dashboard",
    summaryUrl: "",
    addNewPath: "user/dashboard/trade/generic-remitance",
    columnRefName: "REMITTANCE",
  },
  {
    name: "exportProcess",
    backPath: "user/trade/dashboard",
    summaryUrl: "",
    addNewPath: "user/dashboard/trade/export-process-tabs",
    columnRefName: "exportProcess",
  },
  {
    name: "Export Bill Dispatch Request",
    backPath: "user/trade/dashboard",
    summaryUrl: "",
    addNewPath: "user/dashboard/trade/export-bill-dispatch-summary",
    columnRefName: "EXPORT BILL DISPATCH",
  },
  {
    name: "Document Acceptance",
    backPath: "user/trade/dashboard",
    summaryUrl: "",
    addNewPath: "user/dashboard/trade/document-acceptance",
    columnRefName: "BILL_SUMMARY",
  },
  {
    name: "Payment Request Enquiry",
    backPath: "user/trade/dashboard",
    summaryUrl: "",
    addNewPath: "user/dashboard/trade/payment-request-enquiry",
    columnRefName: "BILL_SUMMARY",
  },
  {
    name: "Buyers Credit",
    backPath: "user/trade/dashboard",
    summaryUrl: "",
    addNewPath: "user/dashboard/trade/generic-buyer-credit",
    columnRefName: "BUYER_CREDIT",
  },
  {
    name: "Export SW Bill Lodgement",
    backPath: "user/trade/dashboard",
    summaryUrl: "",
    addNewPath: "user/dashboard/trade/add-export",
    columnRefName: "Export SW Bill",
  },
];

export class SummaryColumns {
  static readonly BGTYPE_SUMMARY = [
    {
      columnDef: "applicant",
      header: "Applicant",
      cell: (element: any) => element.applicant,
    },
    {
      columnDef: "lastUpdatedBy",
      header: "Last Update",
      cell: (element: any) => element.lastUpdatedBy,
    },
    {
      columnDef: "dueDate",
      header: "Due date",
      cell: (element: any) => element.dueDate,
    },
    {
      columnDef: "status",
      header: "Transaction Status",
      cell: (element: any) => element.status,
    },
    {
      columnDef: "requestAssignedTo",
      header: "Assigned to",
      cell: (element: any) => element.requestAssignedTo,
    },
    {
      columnDef: "audit",
      header: "Audit Status",
      cell: (element: any) => {
        if (element.authStatus === "AUTHORIZED") {
          return "APPROVED";
        } else {
          return "UNAPPROVED";
        }
      },
    },
  ];

  static readonly BGTEMPLATE_SUMMARY = [
    {
      columnDef: "name",
      header: "Applicant",
      cell: (element: any) => element.name,
    },
    {
      columnDef: "templateName",
      header: "Template Name",
      cell: (element: any) => element.templateName,
    },
    {
      columnDef: "submitted",
      header: "Submitted on",
      cell: (element: any) => element.submitted,
    },
    {
      columnDef: "billId",
      header: "Bill ID",
      cell: (element: any) => element.billId,
    },
    {
      columnDef: "lastUpdatedBy",
      header: "Last Update",
      cell: (element: any) => element.lastUpdatedBy,
    },
  ];

  static readonly LC_SUMMARY = [
    {
      columnDef: "lcNumber",
      header: "LC Number",
      cell: (element: any) => element.lcNumber,
    },
    {
      columnDef: "invoiceNo",
      header: "Invoice No",
      cell: (element: any) => element.invoiceNo,
    },
    {
      columnDef: "lcOpenDate",
      header: "LC Open Date",
      cell: (element: any) => element.lcOpenDate,
    },
    {
      columnDef: "billId",
      header: "Bill ID",
      cell: (element: any) => element.billId,
    },
    {
      columnDef: "lastUpdatedBy",
      header: "Last Update",
      cell: (element: any) => element.lastUpdatedBy,
    },
    {
      columnDef: "dueDate",
      header: "Due date",
      cell: (element: any) => element.dueDate,
    },
    {
      columnDef: "status",
      header: "Transaction Status",
      cell: (element: any) => element.status,
    },
    {
      columnDef: "requestAssignedTo",
      header: "Assigned to",
      cell: (element: any) => element.requestAssignedTo,
    },
    {
      columnDef: "audit",
      header: "Audit Status",
      cell: (element: any) => {
        if (element.authStatus === "AUTHORIZED") {
          return "APPROVED";
        } else {
          return "UNAPPROVED";
        }
      },
    },
  ];
}
