export class beneficiaryConstant {
  static readonly BENEFICIARY_SUMMARY = [
    {
      columnDef: "payeeName",
      header: "Name",
      cell: (element: any) => element.payeeName,
    },
    {
      columnDef: "accountNumber",
      header: "Account Number",
      cell: (element: any) => element.accountNumber,
    },
    {
      columnDef: "account",
      header: "Account",
      cell: (element: any) => element.account,
    },
    {
      columnDef: "countryName",
      header: "Country",
      cell: (element: any) => element.countryName,
    },
    {
      columnDef: "createdBy",
      header: "Created By",
      cell: (element: any) => element.createdBy,
    },
    {
      columnDef: "created",
      header: "Created on",
      cell: (element: any) => element.created,
    },
    {
      columnDef: "enableAndDisable",
      header: "Enable/Disable",
      cell: (element: any) => element.enableAndDisable,
    },
  ];
}
