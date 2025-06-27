export class SummaryStore {
  static readonly loanDetailsStore = [
    {
      key: 'Loan Details',
      headerInfo: [
        {
          headerCell: 'Loan Amount Requested (GHS)',
          headerDef: 'loanDetail.loanAmount',
        },
        { headerCell: 'Tenure', headerDef: 'loanDetail.loanTenureYear' },
        { headerCell: 'Interest Rate %', headerDef: 'interestRate' },
        { headerCell: 'EMI Amount', headerDef: 'emiAmount' },
        { headerCell: 'EMI Interest Payable', headerDef: 'emiInterestPayable' },
        {
          headerCell: 'Total Principal Amount',
          headerDef: 'totalPrincipalAmount',
        },
        { headerCell: 'Total Payable Amount', headerDef: 'totalPayableAmount' },
        { headerCell: 'Repayment Frequency', headerDef: 'repaymentFrequency' },
        { headerCell: 'EMI Start Date', headerDef: 'emiStartDate' },
        { headerCell: 'Holder Type', headerDef: 'holderType' },
      ],
    },
    {
      key: 'Disbursement Details',
      headerInfo: [
        { headerCell: 'Disbursement Type', headerDef: 'disbursementType' },
        { headerCell: 'Account', headerDef: 'account' },
        {
          headerCell: 'Do you have Internal Account',
          headerDef: 'internalAccount',
        },
        { headerCell: 'Account No', headerDef: 'accountNo' },
        { headerCell: 'Account Holder', headerDef: 'accountHolder' },
        { headerCell: 'Branch Name', headerDef: 'branchName' },
      ],
    },
    {
      key: 'Credit Bureau',
      headerInfo: [
        { headerCell: 'National ID', headerDef: 'nationalId' },
        { headerCell: 'Account No', headerDef: 'accountNo' },
        { headerCell: 'Credit Bureau Status', headerDef: 'creditStatus' },
      ],
    },
  ];
}
