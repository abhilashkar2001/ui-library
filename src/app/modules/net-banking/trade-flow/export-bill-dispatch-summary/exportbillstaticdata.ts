export class exportBillDispatchData {
  static readonly EXPORTBILL_SUMMARY = [
    {
      columnDef: "remNo",
      header: "Beneficiary Name",
      cell: (element: any) => element.remNo,
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
      header: "Submitted On",
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
      header: "Request Assignee",
      cell: (element: any) => element.requestAssignedTo,
    },

    // {
    //   columnDef: "audit",
    //   header: "Audit Status",
    //   cell: (element: any) => {
    //     if (element.authStatus === "AUTHORIZED") {
    //       return "APPROVED";
    //     } else {
    //       return "UNAPPROVED";
    //     }
    //   },
    // },
  ];
  static readonly staticdata = [
    {
      name: 1,
      remNo: 8765,
      invoiceNo: 8765,
      billCategory: "Foreign Sight Collection",
      submitted: "manisha",
      billId: 36776,
      billAmount: "₹ 224672",
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
      billCategory: "Foreign Sight Under LC",
      submitted: "abhilash",
      billId: 2345,
      billAmount: "₹ 224672",
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
      billCategory: "Inland Sight Collection",
      submitted: "Kiyra",
      billId: 66666,
      billAmount: "₹ 224672",
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
      billCategory: "Inland Usance Collection",
      submitted: "Alok sir",
      billId: 7678,
      billAmount: "₹ 224672",
      lastUpdatedBy: "Kc sir",
      submittedOn: "09-03-2024",
      dueDate: "09-03-2024",
      transactionStatus: "Pending",
      requestAssignedTo: "mnbvcf",
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
