export class BulkUploadConstant {
  static readonly GENERIC_COLUMNS = [
    {
      columnDef: "screenNumber",
      header: "Sr.No",
      cell: (element: any) => element.screenNumber,
    },
    {
      columnDef: "status",
      header: "Status",
      cell: (element: any) => element.status,
    },
    {
      columnDef: "soucrceAccount",
      header: "Soucrce Account",
      cell: (element: any) => element.soucrceAccount,
    },
    {
      columnDef: "destinationAccount",
      header: "Destination Account",
      cell: (element: any) => `${element?.destinationAccount}`,
    },
    {
      columnDef: "addressLine1",
      header: "Address Line 1",
      cell: (element: any) => `${element?.addressLine1}`,
    },
    {
      columnDef: "addressLine2",
      header: "Address Line 2",
      cell: (element: any) => `${element?.addressLine2}`,
    },
    {
      columnDef: "country ",
      header: "Country",
      cell: (element: any) => `${element?.country}`,
    },
    {
      columnDef: "pinCode",
      header: "Pin Code",
      cell: (element: any) => `${element?.pinCode}`,
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
}
