export class LoanRepaymentStore {
  static readonly loanAccountDetails: HeaderModel[] = [
    {
      headerCell: "Current Due",
      headerDef: "totalAmtDue"
    },
    {
      headerCell: "Due Date",
      headerDef: "installmentDate"
    },
    {
      headerCell: "Duration",
      headerDef: "duration"
    },
    {
      headerCell: "Principal Outstanding",
      headerDef: "outstandPrincpl"
    },
    {
      headerCell: "EMI Amount",
      headerDef: "emiAmount"
    },
    {
      headerCell: "Arrear",
      headerDef: "arrear"
    },
    {
      headerCell: "Interest Rate",
      headerDef: "interestRate"
    },
    {
      headerCell: "Loan Breakup Dues",
      headerDef: ""
    }
  ];
}

export interface HeaderModel {
  headerCell: string | any;
  headerDef: string | any;
}

// export interface infoContentType {
//     header: HeaderDetail;
//     body: PriceDetail[];
// }
