export class eefcConstant {
  static readonly EEFC_SUMMARY = [
    {
      columnDef: "benificiaryName",
      header: "Benificiary Name",
      cell: (element: any) => element.benificiaryName,
    },
    {
      columnDef: "submittedOn",
      header: "Submitted On",
      cell: (element: any) => element.submittedOn,
    },
    {
      columnDef: "dueDate",
      header: "Due Date",
      cell: (element: any) => element.dueDate,
    },
    {
      columnDef: "transactionStatus",
      header: "Transaction Status",
      cell: (element: any) => element.transactionStatus,
    },
    {
      columnDef: "requestAssignedTo",
      header: "Request Assigned To",
      cell: (element: any) => element.requestAssignedTo,
    },
    {
      columnDef: "audit",
      header: "Audit",
      cell: (element: any) => element.audit,
    },
  ];

  static readonly eefcStaticData = [
    {
      benificiaryName: "John Patra",
      submittedOn: "09-01-2024",
      transactionStatus: "Completed",
      requestAssignedTo: "Champa",
      dueDate: "09-03-2024",
      audit: "Unapproved",
    },
    {
      benificiaryName: "Smith Jena",
      submittedOn: "09-01-2024",
      transactionStatus: "Completed",
      requestAssignedTo: "Kumbha",
      dueDate: "09-03-2024",
      audit: "Unapproved",
    },
    {
      benificiaryName: "Justin Behera",
      submittedOn: "09-01-2024",
      transactionStatus: "Completed",
      requestAssignedTo: "Kanta",
      dueDate: "09-03-2024",
      audit: "Unapproved",
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
