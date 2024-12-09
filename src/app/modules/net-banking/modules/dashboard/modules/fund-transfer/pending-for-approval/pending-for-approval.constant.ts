export class PendingForApprovalConstant {
  static readonly UPLOAD_SUMMARY = [
    {
      columnDef: "refNumber",
      header: "Ref Number",
      cell: (element: any) => element.refNumber
    },
    {
      columnDef: "fileName",
      header: "File Name",
      cell: (element: any) => element.fileName
    },
    {
      columnDef: "actionBy",
      header: "Action By",
      cell: (element: any) => element.lastUpdatedBy
    },
    {
      columnDef: "lastupdated",
      header: "Date & Time",
      cell: (element: any) => `${element?.lastupdated}`
    },
    {
      columnDef: "authStatus",
      header: "Approved",
      cell: (element: any) => `${element?.authStatus}`
    }
  ];
  static readonly PENDING_SUMMARY = [
    {
      columnDef: "transactionReferenceNo",
      header: "Ref Number",
      cell: (element: any) => element.transactionReferenceNo
    },
    {
      columnDef: "productType",
      header: "Produt Type",
      cell: (element: any) => element.productType
    },
    {
      columnDef: "lastUpdated",
      header: "Date & Time",
      cell: (element: any) => element.lastUpdated
    },
    {
      columnDef: "totalAmount",
      header: "Amount",
      cell: (element: any) => `${element?.totalAmount}`
    },
    {
      columnDef: "lastUpdatedBy",
      header: "Initiated By",
      cell: (element: any) => `${element?.lastUpdatedBy}`
    },
    {
      columnDef: "fileName",
      header: "File Name",
      cell: (element: any) => `${element?.fileName}`
    },
    {
      columnDef: "status",
      header: "Status",
      cell: (element: any) => {
        let pendingCount = 0;
        let approvedCount = 0;
        let rejectedCount = 0;
        element.corpFundDetails.forEach((element: any) => {
          switch (element.uploadstatus) {
            case null:
            case "PENDING":
              pendingCount++;
              break;
            case "APPROVED":
              approvedCount++;
              break;
            case "REJECTED":
              rejectedCount++;
              break;
          }
        });
        if (pendingCount === element.corpFundDetails.length) {
          return "Pending";
        } else if (approvedCount === element.corpFundDetails.length) {
          return "Approved";
        } else if (rejectedCount === element.corpFundDetails.length) {
          return "Rejected";
        } else {
          return "Pending";
        }
      }
    }
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
      soucrceAccount: 3223243
    },
    {
      screenNumber: 2,
      status: "Aapproved",
      country: "India",
      pinCode: 328,
      addressLine2: "xnewuihdh",
      addressLine1: "iuqend",
      destinationAccount: 3322,
      soucrceAccount: 3223243
    },
    {
      screenNumber: 3,
      status: "Unapproved",
      country: "India",
      pinCode: 83892,
      addressLine2: "ewhj",
      addressLine1: "wiokqmo",
      destinationAccount: 3322,
      soucrceAccount: 3223243
    },
    {
      screenNumber: 4,
      status: "Approved",
      country: "India",
      pinCode: 4878734,
      addressLine2: "dsk",
      addressLine1: "ekmd",
      destinationAccount: 7838723322,
      soucrceAccount: 3222283243
    }
  ];

  static readonly STATIC_SUMMARY = [
    {
      refNumber: 1,
      fileName: "ashjds",
      actionBy: "Indkjsd ia",
      lastupdated: "03/1/2023",
      authStatus: "Unapproved"
    },
    {
      refNumber: 2,
      fileName: "32hj",
      actionBy: "jay",
      lastupdated: "03/1/2023",
      authStatus: "Approved"
    },
    {
      refNumber: 3,
      fileName: "32j",
      actionBy: "shah",
      lastupdated: "03/1/2023",
      authStatus: "Approved"
    },
    {
      refNumber: 4,
      fileName: "jh32",
      actionBy: "Ronaldo",
      lastupdated: "03/1/2023",
      authStatus: "unApproved"
    }
  ];
}
