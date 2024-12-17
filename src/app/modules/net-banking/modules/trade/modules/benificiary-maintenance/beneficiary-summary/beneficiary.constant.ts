export class beneficiaryConstant {
  static readonly BENEFICIARY_SUMMARY = [
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element: any) => element.name,
    },
    {
      columnDef: 'accountNo',
      header: 'Account Number',
      cell: (element: any) => element.accountNo,
    },
    {
      columnDef: 'accountType',
      header: 'Account',
      cell: (element: any) => element.accountType,
    },
    {
      columnDef: 'countryName',
      header: 'Country',
      cell: (element: any) => element.countryName,
    },
    {
      columnDef: 'createdBy',
      header: 'Created By',
      cell: (element: any) => element.createdBy,
    },
    {
      columnDef: 'created',
      header: 'Created on',
      cell: (element: any) => element.created,
    },
    {
      columnDef: 'beneficiaryStatus',
      header: 'Enable/Disable',
      cell: (element: any) =>
        element.beneficiaryStatus ? 'Enable' : 'Disable',
    },
  ];
}
