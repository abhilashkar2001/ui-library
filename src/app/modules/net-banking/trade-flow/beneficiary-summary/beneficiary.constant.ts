export class beneficiaryConstant {
  static readonly BENEFICIARY_SUMMARY = [
    {
      columnDef: "name",
      header: "Name",
      cell: (element: any) => element.name,
    },
    {
      columnDef: "AccountNo",
      header: "Account Number",
      cell: (element: any) => element.AccountNo,
    },
    {
      columnDef: "account",
      header: "Account",
      cell: (element: any) => element.account,
    },
    {
      columnDef: "country",
      header: "Country",
      cell: (element: any) => element.country,
    },
    {
      columnDef: "createdBy",
      header: "Created By",
      cell: (element: any) => element.createdBy,
    },
    {
      columnDef: "createdOn",
      header: "Created on",
      cell: (element: any) => element.createdOn,
    },
    {
      columnDef: "enableAndDisable",
      header: "Enable/Disable",
      cell: (element: any) => element.enableAndDisable,
    },
  ];

  static readonly staticData = [
    {
      name: 1,
      AccountNo: "Unapproved",
      account: "India",
      country: 36776,
      createdBy: "ewnewoind",
      createdOn: "ekmd",
      enableAndDisable: 3322,
    },
    {
      name: 1,
      AccountNo: "Unapproved",
      account: "India",
      country: 36776,
      createdBy: "ewnewoind",
      createdOn: "ekmd",
      enableAndDisable: 3322,
    },
  ];
}
