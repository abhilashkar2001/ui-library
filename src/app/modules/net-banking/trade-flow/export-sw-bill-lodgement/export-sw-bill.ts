export class ExportSwBill{

    static readonly EXPORTSWBILL_SUMMARY = [
       {
         columnDef: "beneficiaryName",
         header: "Beneficiary Name",  
         cell: (element: any) => element.beneficiaryName,
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
           beneficiaryName: "Usha",
           invoiceNo: 8765,
           billCategory:"Foreign Sight Collection",
           billId: 36776,
           billAmount: 200,
           submittedOn:"09-03-2024",
           dueDate: "09-03-2024",
           status: "Pending",
           requestAssignedTo: "Sree",
           audit: "Unapproved",
         },
         {
            beneficiaryName: "Siva",
            invoiceNo: 8765,
            billCategory:"Foreign Sight Collection",
            billId: 36776,
            billAmount: 200,
            submittedOn:"09-03-2024",
            dueDate: "09-03-2024",
            status: "Pending",
            requestAssignedTo: "Venky",
            audit: "Unapproved",
          },
          {
            beneficiaryName: "Sony",
            invoiceNo: 8765,
            billCategory:"Foreign Sight Collection",
            billId: 36776,
            billAmount: 200,
            submittedOn:"09-03-2024",
            dueDate: "09-03-2024",
            status: "Pending",
            requestAssignedTo: "Mahadev",
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