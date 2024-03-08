export class bgConstant {
  static readonly BGTYPE_SUMMARY = [
    {
      columnDef: "name",
      header: "Applicant",
      cell: (element: any) => element.name,
    },
    {
      columnDef: "invoiceNo",
      header: "Invoice No",
      cell: (element: any) => element.invoiceNo,
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
    {
      columnDef: "dueDate",
      header: "Due date",
      cell: (element: any) => element.dueDate,
    },
    {
      columnDef: "transStatus",
      header: "Transaction Status",
      cell: (element: any) => element.transStatus,
    },
    {
      columnDef: "requestAssignedTo",
      header: "Request Assigned to",
      cell: (element: any) => element.requestAssignedTo,
    },
    {
      columnDef: "audit",
      header: "Audit",
      cell: (element: any) => element.audit,
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
    {
      columnDef: "requestAssignedTo",
      header: "Request Assigned to",
      cell: (element: any) => element.requestAssignedTo,
    }
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
      audit: "Unapproved"
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
      audit: "Approved"
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
}
