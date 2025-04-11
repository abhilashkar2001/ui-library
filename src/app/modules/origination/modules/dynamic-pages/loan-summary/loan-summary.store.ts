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
          headKey: 'repaymentFrequency',
        },

        {
          header: 'Interest Rate',
          headKey: 'interestRate',
          isPercentage: true,
        },
        { header: 'EMI Amount', headKey: 'emiAmount', isCurrency: true },
        {
          header: 'EMI Interset Payable',
          headKey: 'emiInterestPayable',
          isCurrency: true,
        },
        {
          header: 'Total Interset Amount',
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
          headKey: 'emiStartDate',
        },
        {
          header: 'EMI End Date',
          headKey: 'emiEndDate',
        },
      ],
    },
    {
      title: 'Main Banking Details',
      headerKey: 'mainBankDetails',
      headerInfo: [
        { header: 'Account', headKey: 'account' },
        { header: 'Bank Name', headKey: 'bankName' },
        { header: 'Account Number', headKey: 'accountNumber' },
        { header: 'Account Type', headKey: 'accountType' },
        { header: 'Account Name', headKey: 'accountName' },
        { header: 'Disbursement Type', headKey: 'disbursementType' },
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
        { header: 'Date issued', headKey: 'branchName' },
        { header: 'Country of Residence', headKey: 'branchName' },
        { header: 'Marital Status', headKey: 'branchName' },
        { header: 'Identification Number', headKey: 'branchName' },
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
        { header: 'Statement Via', headKey: 'commPhoneValue' },
        { header: 'Address', headKey: 'contact.address[0].address1' },
        {
          header: 'Residential Status',
          headKey: 'contact.address[0].address1',
        },
        { header: 'Suburd', headKey: 'contact.address[0].address1' },
        { header: 'City', headKey: 'contact.address[0].address1' },
        { header: 'Postal Code', headKey: 'contact.address[0].address1' },
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
        { header: 'Nationality', headKey: 'nationality' },
        { header: 'Telephone (home)*', headKey: 'accountNumber' },
        { header: 'Telephone (work)* ', headKey: 'accountType' },
        { header: 'Mobile Number*', headKey: 'mobile' },
        { header: 'Email ID', headKey: 'email' },
        { header: 'Employee Status', headKey: 'accountType' },
        { header: 'Net Income', headKey: 'accountType' },
      ],
    },
    {
      title: 'Emergency Contact / Next of Kin',
      headerKey: 'emergencyContactInfo',
      headerInfo: [
        { header: 'Prefix*', headKey: 'prefix' },
        { header: 'First Name*', headKey: 'bankName' },
        { header: 'Last Name*', headKey: 'accountNumber' },
        { header: 'Date of Birth* ', headKey: 'accountType' },
        { header: 'Telephone (home)*', headKey: 'accountNumber' },
        { header: 'Telephone (work)* ', headKey: 'accountType' },
        { header: 'Mobile Number*', headKey: 'accountNumber' },
        { header: 'Email ID', headKey: 'accountType' },
        { header: 'Employee Status', headKey: 'accountType' },
        { header: 'Net Income', headKey: 'accountType' },
      ],
    },
  ];

  static readonly BusinessDetailsStore = [
    {
      title: 'Business Details',
      headerKey: 'businessDetailModel',
      headerInfo: [
        { header: 'Business Name', headKey: 'prefix' },
        { header: 'Telephone No', headKey: 'bankName' },
        { header: 'Address', headKey: 'accountNumber' },
        { header: 'No of Years in Operation ', headKey: 'accountType' },
        { header: 'Industry', headKey: 'accountName' },
        { header: 'AVE Stock level', headKey: 'disbursementType' },
        { header: 'Types of Good service', headKey: 'branchName' },
        { header: 'Monthly Turn Over', headKey: 'branchName' },
      ],
    },
  ];
  static readonly CollateralDetailsStore = [
    {
      title: 'Collateral Details',
      sections: [
        {
          title: 'Credit Card Details',
          fields: [
            { header: 'Description', key: 'description' },
            { header: 'Ownership', key: 'ownership' },
            { header: 'Asset Monetary worth', key: 'worth' },
          ],
          dataKey: 'creditCardDetails',
        },
        {
          title: 'VAF Details',
          fields: [
            { header: 'Description', key: 'description' },
            { header: 'Ownership', key: 'ownership' },
            { header: 'Asset Monetary worth', key: 'worth' },
          ],
          dataKey: 'vafDetails',
        },
      ],
      footer: [
        { header: 'Loan Type', key: 'loanType' },
        { header: '% of Security Cover', key: 'securityCover' },
      ],
    },
  ];
}
