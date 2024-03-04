export class BulkUploadConstant {
  static readonly GENERIC_COLUMNS = [
    {
      columnDef: "icustReffNo",
      header: "Ref No.",
      cell: (element: any) => element.icustReffNo,
    },
    // {
    //   columnDef: "status",
    //   header: "Beneficiary Name",
    //   cell: (element: any) => element.authStatus,
    // },
    {
      columnDef: "soucrceAccount",
      header: "Soucrce Account",
      cell: (element: any) => element.sourceAccount,
    },
    {
      columnDef: "destinationAccount",
      header: "Destination Account",
      cell: (element: any) => `${element?.destinationAccount}`,
    },
    {
      columnDef: "customerName",
      header: "Beneficiary Name",
      cell: (element: any) => `${element?.customerName}`,
    },
    {
      columnDef: "transferMode",
      header: "Transfer Mode",
      cell: (element: any) => `${element?.transferMode}`,
    },
    {
      columnDef: "transferType ",
      header: "Transfer Type",
      cell: (element: any) => `${element?.transferType}`,
    },
    {
      columnDef: "ifcsCode",
      header: "IFSC Code",
      cell: (element: any) => `${element?.ifcsCode}`,
    },
    {
      columnDef: "transactionAmount",
      header: "Ammount",
      cell: (element: any) => `${element?.transactionAmount}`,
    },
  ];

  static readonly staticData = [
    {
      screenNumber: 1,
      status: "Unapproved",
      country: "India",
      pinCode: 36776,
      addressLine2: "ewnewoind",
      addressLine1: "ekmd",
      destinationAccount: 3322,
      soucrceAccount: 3223243,
    },
    {
      screenNumber: 2,
      status: "Aapproved",
      country: "India",
      pinCode: 328,
      addressLine2: "xnewuihdh",
      addressLine1: "iuqend",
      destinationAccount: 3322,
      soucrceAccount: 3223243,
    },
    {
      screenNumber: 3,
      status: "Unapproved",
      country: "India",
      pinCode: 83892,
      addressLine2: "ewhj",
      addressLine1: "wiokqmo",
      destinationAccount: 3322,
      soucrceAccount: 3223243,
    },
    {
      screenNumber: 4,
      status: "Approved",
      country: "India",
      pinCode: 4878734,
      addressLine2: "dsk",
      addressLine1: "ekmd",
      destinationAccount: 7838723322,
      soucrceAccount: 3222283243,
    },
  ];

  static readonly STATIC_SUMMARY = [
    {
      refNumber: 1,
      fileName: "ashjds",
      actionBy: "Indkjsd ia",
      lastupdated: "03/1/2023",
      authStatus: "Unapproved",
    },
    {
      refNumber: 2,
      fileName: "32hj",
      actionBy: "jay",
      lastupdated: "03/1/2023",
      authStatus: "Approved",
    },
    {
      refNumber: 3,
      fileName: "32j",
      actionBy: "shah",
      lastupdated: "03/1/2023",
      authStatus: "Approved",
    },
    {
      refNumber: 4,
      fileName: "jh32",
      actionBy: "Ronaldo",
      lastupdated: "03/1/2023",
      authStatus: "unApproved",
    },
  ];

  static readonly UPLOAD_SUMMARY = [
    {
      columnDef: "refNumber",
      header: "Ref Number",
      cell: (element: any) => element.transactionReferenceNo,
    },
    {
      columnDef: "fileName",
      header: "File Name",
      cell: (element: any) => element.templateName,
    },
    {
      columnDef: "totalAmount",
      header: "Total Amount",
      cell: (element: any) => element.totalAmount,
    },
    {
      columnDef: "actionBy",
      header: "Action By",
      cell: (element: any) => element.lastUpdatedBy,
    },
    {
      columnDef: "lastUpdated",
      header: "Date & Time",
      cell: (element: any) => element.lastUpdated,
    },

    {
      columnDef: "status",
      header: "Approved",
      cell: (element: any) => `${element?.status}`,
    },
  ];
}
