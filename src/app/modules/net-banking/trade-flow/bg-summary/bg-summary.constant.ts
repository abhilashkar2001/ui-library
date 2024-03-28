export class bgConstant {
  static readonly BGTYPE_SUMMARY = [
    {
      columnDef: "applicant",
      header: "Applicant",
      cell: (element: any) => element.applicant,
    },
    // {
    //   columnDef: "invoiceNo",
    //   header: "Invoice No",
    //   cell: (element: any) => element.invoiceNo,
    // },
    // {
    //   columnDef: "submittedOn",
    //   header: "Submitted on",
    //   cell: (element: any) => element.submittedOn,
    // },
    // {
    //   columnDef: "billId",
    //   header: "Bill ID",
    //   cell: (element: any) => element.billId,
    // },
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
    // {
    //   columnDef: "requestAssignedTo",
    //   header: "Request Assigned to",
    //   cell: (element: any) => element.requestAssignedTo,
    // },
  ];

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
