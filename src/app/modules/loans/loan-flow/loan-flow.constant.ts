export class LoanFlowConstants {
  static readonly CUSTOM_HEADER = [
    {
      title: "Loan Details",
      headerKey: "loanDetails",
      headerInfo: [
        { header: "loan Ammount", headKey: "loanAmount" },
        { header: "Tenure", headKey: "loanTenure" },
        { header: "EMI Ammount", headKey: "emiAmount" },
        { header: "Interest Rate", headKey: "interestRate" },
        { header: "Interest Paybale", headKey: "interestPayable" },
        { header: "Principle Ammount", headKey: "principalAmount" },
        { header: "Total Payable Ammount", headKey: "totalPayableAmount" },
        { header: "Holder Type", headKey: "holderType" },
      ],
    },
    {
      title: "Disbursement Details",
      headerKey: "disbursementDetails",
      headerInfo: [
        { header: "Type", headKey: "disbursementType" },
        { header: "Account Number", headKey: "accountNo" },
        { header: "Name", headKey: "name" },
        { header: "Emi Payment Start Date", headKey: "emiStartDate" },
      ],
    },
    {
      title: "Bank Account",
      headerKey: "bankAccount",
      headerInfo: [
        { header: "Your Account", headKey: "yourAccount" },
        { header: "Name", headKey: "name" },
        { header: "Your Pan Card", headKey: "yourPan" },
      ],
    },
  ];
}
