export class BeneficiaryBulkUploadConstant {
  static readonly STATIC_SUMMARY = [
    {
      refNumber: 1,
      fileName: 'ashjds',
      actionBy: 'Indkjsd ia',
      lastupdated: '03/1/2023',
      authStatus: 'Unapproved',
    },
    {
      refNumber: 2,
      fileName: '32hj',
      actionBy: 'jay',
      lastupdated: '03/1/2023',
      authStatus: 'Approved',
    },
    {
      refNumber: 3,
      fileName: '32j',
      actionBy: 'shah',
      lastupdated: '03/1/2023',
      authStatus: 'Approved',
    },
    {
      refNumber: 4,
      fileName: 'jh32',
      actionBy: 'Ronaldo',
      lastupdated: '03/1/2023',
      authStatus: 'unApproved',
    },
  ];

  static readonly UPLOAD_SUMMARY = [
    {
      columnDef: 'refNumber',
      header: 'Ref Number',
      cell: (element: any) => element.refNumber,
    },
    {
      columnDef: 'fileName',
      header: 'File Name',
      cell: (element: any) => element.fileName,
    },
    {
      columnDef: 'actionBy',
      header: 'Action By',
      cell: (element: any) => element.lastUpdatedBy,
    },
    {
      columnDef: 'lastUpdated',
      header: 'Date & Time',
      cell: (element: any) => element.lastUpdated,
    },

    {
      columnDef: 'status',
      header: 'Approved',
      cell: (element: any) => `${element?.status}`,
    },
  ];
}
