export class staticRemittanceData{

     readonly REMITTANCE_SUMMARY = [
        {
          columnDef: "remNo",
          header: "Remittance No",  
          cell: (element: any) => element.remNo,
        },
        {
          columnDef: "invoiceNo",
          header: "Invoice No",
          cell: (element: any) => element.invoiceNo,
        },
        {
          columnDef: "submittedOn",
          header: "LC Open date",
          cell: (element: any) => element.submittedOn,
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
          columnDef: "status",
          header: "Transaction Status",
          cell: (element: any) => element.status,
        },
        {
          columnDef: "requestAssignedTo",
          header: "Assigned to",
          cell: (element: any) => element.requestAssignedTo,
        },
        {
          columnDef: "audit",
          header: "Audit Status",
          cell: (element: any) => {
            if (element.authStatus === "AUTHORIZED") {
              return "APPROVED";
            } else {
              return "UNAPPROVED";
            }
          },
        },
      ];
      static readonly staticdata = [
        {
            name: 1,
            remNo:8765,
            invoiceNo: 8765,
            submitted: "manisha",
            billId: 36776,
            lastUpdatedBy: "xyz",
            submittedOn:"09-03-2024",
            dueDate: "09-03-2024",
            transStatus: "Pending",
            requestAssignedTo: "jghg",
            audit: "Unapproved",
          },
        {
            name: 2,
            remNo:2345,
            invoiceNo: 234,
            submitted: "abhilash",
            billId: 2345,
            lastUpdatedBy: "sid",
            submittedOn:"09-03-2024",
            dueDate: "09-03-2024",
            transStatus: "Pending",
            requestAssignedTo: "jhgfdrtg",
            audit: "Unapproved",
          },
        {
            name: 3,
            remNo:9876,
            invoiceNo: 7666,
            submitted: "Kiyra",
            billId: 66666,
            lastUpdatedBy: "abhimannu",
            submittedOn:"09-03-2024",
            dueDate: "09-03-2024",
            transStatus: "Pending",
            requestAssignedTo: "hgfd",
            audit: "Unapproved",
          },
        {
            name: 4,
            remNo:78665,
            invoiceNo: 98877,
            submitted: "Alok sir",
            billId: 7678,
            lastUpdatedBy: "Kc sir",
            submittedOn:"09-03-2024",
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