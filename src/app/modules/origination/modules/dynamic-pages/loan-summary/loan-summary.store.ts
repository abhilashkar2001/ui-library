export class LoanSummaryStore {
  static readonly LOANSUMMARY = [
    {
      title: 'Loan Details',
      headerKey: 'loanDetail',
      headerInfo: [
        { header: 'Loan Amount', headKey: 'loanAmount', isCurrency: true },
        { header: 'Tenure', headKey: 'loanTenure', isTenure: true },
        {
          header: 'Repayment Frequency',
          headKey: 'repaymentFrequencyValue',
        },
        {
          header: 'Interest Rate',
          headKey: 'interestRate',
          isPercentage: true,
        },
        { header: 'EMI Amount', headKey: 'emiAmount', isCurrency: true },
        {
          header: 'EMI Interest Payable',
          headKey: 'emiInterestPayable',
          isCurrency: true,
        },
        {
          header: 'Total Interest Amount',
          headKey: 'totalInterestAmount',
          isCurrency: true,
        },
        {
          header: 'Total Payable Amount',
          headKey: 'totalPayableAmount',
          isCurrency: true,
        },
        {
          header: 'EMI Start Date',
          headKey: 'firstRepaymentDate',
        },
        {
          header: 'Installment Start Date',
          headKey: 'firstRepaymentDate',
        },
      ],
    },
    {
      title: 'Main Banking Details',
      headerKey: 'loanDisbursementModel',
      headerInfo: [
        { header: 'Account', headKey: 'internal' },
        { header: 'Bank Name', headKey: 'bankName' },
        { header: 'Account Number', headKey: 'accountNo' },
        { header: 'Account Type', headKey: 'accountTypeValue' },
        { header: 'Account Name', headKey: 'customerName' },
        { header: 'Disbursement Type', headKey: 'disbursementTypeValue' },
        { header: 'Branch Name', headKey: 'branchName' },
      ],
    },
  ];

  static readonly PersonalDetailsStore = [
    {
      title: 'Personal Identification',
      headerKey: 'customerInfo',
      headerInfo: [
        { header: 'Prefix*', headKey: 'prefixValue' },
        { header: 'First Name*', headKey: 'firstName' },
        { header: 'Last Name*', headKey: 'lastName' },
        { header: 'Date of Birth* ', headKey: 'dateOfBirth' },
        { header: 'Nationality', headKey: 'nationality' },
        { header: 'Gender', headKey: 'genderValue' },
        { header: 'Date issued', headKey: 'issueDate' },
        { header: 'Country of Residence', headKey: 'countryOfIssue' },
        { header: 'Marital Status', headKey: 'maritalStatusValue' },
        { header: 'Identification Number', headKey: 'documentNumber' },
      ],
    },
    {
      title: 'Contact Details',
      headerKey: 'customerInfo',
      headerInfo: [
        { header: 'Mobile Number', headKey: 'mobile' },
        { header: 'Alternate Number', headKey: 'alternativeNumber' },
        { header: 'Whatsapp Number', headKey: 'whatsappNo' },
        { header: 'Email ID', headKey: 'email' },
        { header: 'Telephone (home)', headKey: 'telephone' },
        { header: 'Telephone(work)', headKey: 'worktelephone' },
        { header: 'Fax', headKey: 'fax' },
        { header: 'Statement Via', headKey: 'statementViaValue' },
        { header: 'Address', headKey: 'address1' },
        {
          header: 'Residential Status',
          headKey: 'residenceTypeValue',
        },
        { header: 'Suburb', headKey: 'address2' },
        { header: 'City', headKey: 'cityName' },
        { header: 'Postal Code', headKey: 'pincode' },
        { header: 'Living Address Since', headKey: 'branchName' },
      ],
    },
    {
      title: 'Spouse Details',
      headerKey: 'customerInfo',
      headerInfo: [
        { header: 'Prefix*', headKey: 'prefixValue' },
        { header: 'First Name*', headKey: 'firstName' },
        { header: 'Last Name*', headKey: 'lastName' },
        { header: 'Date of Birth* ', headKey: 'dateOfBirth' },
        { header: 'Telephone (home)*', headKey: 'telephone' },
        { header: 'Telephone (work)* ', headKey: 'worktelephone' },
        { header: 'Mobile Number*', headKey: 'mobile' },
        { header: 'Email ID', headKey: 'email' },
        { header: 'Employee Status', headKey: 'employeeStatusValue' },
        { header: 'Net Income', headKey: 'netIncome' },
      ],
    },
    {
      title: 'Emergency Contact / Next of Kin',
      headerKey: 'customerInfo',
      headerInfo: [
        { header: 'Prefix*', headKey: 'prefixValue' },
        { header: 'First Name*', headKey: 'firstName' },
        { header: 'Last Name*', headKey: 'lastName' },
        { header: 'Relationship*', headKey: 'relationshipValue' },
        { header: 'Mobile Number*', headKey: 'mobile' },
        { header: 'Alternate Number', headKey: 'alternativeNumber' },
        { header: 'Whatsapp Number', headKey: 'whatsappNo' },
        { header: 'Telephone (home)*', headKey: 'telephone' },
        { header: 'Telephone (work) ', headKey: 'worktelephone' },
        { header: 'Address', headKey: 'address1' },
        { header: 'Residential Status', headKey: 'residenceTypeValue' },
        { header: 'Suburb', headKey: 'address2' },
        { header: 'City', headKey: 'cityName' },
        { header: 'Postal Code', headKey: 'pincode' },
      ],
    },
  ];

  static readonly BusinessDetailsStore = [
    {
      title: 'Business Details',
      headerKey: 'businessModel',
      headerInfo: [
        { header: 'Business Name', headKey: 'businessName' },
        { header: 'Telephone No', headKey: 'telephone' },
        { header: 'Address', headKey: 'address1' },
        { header: 'No of Years in Operation ', headKey: 'yearsOfOperation' },
        { header: 'Industry', headKey: 'natureOfBusinessValue' },
        { header: 'AVE Stock level', headKey: 'aveStockLevel' },
        { header: 'Types of Good service', headKey: 'typeOfService' },
        { header: 'Monthly Turn Over', headKey: 'monthlyTurnover' },
      ],
    },
  ];
  static readonly CollateralDetailsStore = [
    {
      title: 'Collateral Details',
      headerInfo: 'collateralInfo',
      sections: [
        {
          title: 'Credit Card Details',
          fields: [
            { header: 'Description', key: 'collateralDescriptionForCredit' },
            { header: 'Ownership', key: 'ownershipForCredit' },
            {
              header: 'Asset Monetary worth',
              key: 'assetMonetaryWorthForCredit',
            },
          ],
          dataKey: 'creditCardDetails',
        },
        {
          title: 'VAF Details',
          fields: [
            { header: 'Description', key: 'collateralDescriptionForVaf' },
            { header: 'Ownership', key: 'ownershipForVaf' },
            { header: 'Asset Monetary worth', key: 'assetMonetaryWorthForVaf' },
          ],
          dataKey: 'vafDetails',
        },
      ],
      footer: [
        { header: 'Loan Type', key: 'loanTypeValue' },
        { header: '% of Security Cover', key: 'percentageOfSecurityCover' },
      ],
    },
  ];
}
