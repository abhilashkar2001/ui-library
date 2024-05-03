export class staticBuyerCreditData {

  static readonly BUYER_CREDIT_SUMMARY = [
    {
      columnDef: "benificiaryName",
      header: "Beneficiary Name",
      cell: (element: any) => element.benificiaryName,
    },
    {
      columnDef: "invoiceNo",
      header: "Invoice No",
      cell: (element: any) => element.invoiceNo,
    },
    {
      columnDef: "billCategory",
      header: "Bill Category",
      cell: (element: any) => element.billCategory,
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
      columnDef: "trnStatus",
      header: "Transaction Status",
      cell: (element: any) => element.trnStatus,
    },
    {
      columnDef: "requestAssignedTo",
      header: "Request Assigned to",
      cell: (element: any) => element.requestAssignedTo,
    }
  ];
  static readonly staticdata = [
    {
      name: 1,
      remNo: 8765,
      invoiceNo: 8765,
      submitted: "manisha",
      billId: 36776,
      lastUpdatedBy: "xyz",
      submittedOn: "09-03-2024",
      dueDate: "09-03-2024",
      transStatus: "Pending",
      requestAssignedTo: "jghg",
      audit: "Unapproved",
    },
    {
      name: 2,
      remNo: 2345,
      invoiceNo: 234,
      submitted: "abhilash",
      billId: 2345,
      lastUpdatedBy: "sid",
      submittedOn: "09-03-2024",
      dueDate: "09-03-2024",
      transStatus: "Pending",
      requestAssignedTo: "jhgfdrtg",
      audit: "Unapproved",
    },
    {
      name: 3,
      remNo: 9876,
      invoiceNo: 7666,
      submitted: "Kiyra",
      billId: 66666,
      lastUpdatedBy: "abhimannu",
      submittedOn: "09-03-2024",
      dueDate: "09-03-2024",
      transStatus: "Pending",
      requestAssignedTo: "hgfd",
      audit: "Unapproved",
    },
    {
      name: 4,
      remNo: 78665,
      invoiceNo: 98877,
      submitted: "Alok sir",
      billId: 7678,
      lastUpdatedBy: "Kc sir",
      submittedOn: "09-03-2024",
      dueDate: "09-03-2024",
      transStatus: "Pending",
      requestAssignedTo: "mnbvcf",
      audit: "Unapproved",
    },
  ]

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