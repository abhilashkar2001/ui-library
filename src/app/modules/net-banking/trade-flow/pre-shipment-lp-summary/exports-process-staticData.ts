export class ExportProcess {
  static readonly EXPORTPROCESS_SUMMARY = [
    {
      columnDef: "beneficiaryName",
      header: "Beneficiary Name",
      cell: (element: any) => element.beneficiaryName,
    },
    {
      columnDef: "invoiceNo",
      header: "Invoice No",
      cell: (element: any) => element.invoiceNo,
    },
    {
      columnDef: "submittedOn",
      header: "Submitted on",
      cell: (element: any) => element.submittedOn,
    },
    {
      columnDef: "billId",
      header: "Bill ID",
      cell: (element: any) => element.billId,
    },
    {
      columnDef: "billAmount",
      header: "Bill Amount",
      cell: (element: any) => element.billAmount,
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
      header: "Request Assigned to",
      cell: (element: any) => element.requestAssignedTo,
    },
    {
      columnDef: "audit",
      header: "Audit",
      cell: (element: any) => {
        if (element.authStatus === "AUTHORIZED") {
          return "APPROVED";
        } else {
          return "UNAPPROVED";
        }
      },
    },
  ];
  static readonly staticdata = [
    {
      beneficiaryName: "Dell",
      invoiceNo: 8765,
      billId: 36776,
      billAmount: 2000,
      submittedOn: "09-03-2024",
      dueDate: "09-03-2024",
      status: "Pending",
      requestAssignedTo: "Mac",
      audit: "Unapproved",
    },
    {
      beneficiaryName: "HP",
      invoiceNo: 8766,
      billId: 36776,
      billAmount: 200,
      submittedOn: "09-03-2024",
      dueDate: "09-03-2024",
      status: "Pending",
      requestAssignedTo: "intel",
      audit: "Unapproved",
    },
    {
      beneficiaryName: "Sony",
      invoiceNo: 8767,
      billId: 36776,
      billAmount: 20000,
      submittedOn: "05-03-2024",
      dueDate: "05-03-2024",
      status: "Completed",
      requestAssignedTo: "sony",
      audit: "Approved",
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
