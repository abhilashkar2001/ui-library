export class SummaryStore {
  static readonly loanDetailsStore = [
    {
      title: 'Loan Details',
      key: 'loanDetail',
      headerInfo: [
        {
          headerCell: 'Loan Amount Requested (GHS)',
          headerDef: 'loanAmount',
        },
        { headerCell: 'Tenure', headerDef: 'loanTenureYear' },
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
      title: 'Document Upload',
      key: 'documentUpload',
      headerInfo: [
        {
          headerCell: 'Last 6 Months Bank Statement *',
          headerDef: 'parentCompany',
        },
      ],
    },
    {
      title: 'Disbursement Details',
      key: 'disbursementDetail',
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
      title: 'Credit Bureau',
      key: 'creditBureau',
      headerInfo: [
        { headerCell: 'National ID', headerDef: 'nationalId' },
        { headerCell: 'Account No', headerDef: 'accountNo' },
        { headerCell: 'Credit Bureau Status', headerDef: 'creditStatus' },
      ],
    },
    {
      title: 'Business Details',
      key: 'businessDetails',
      headerInfo: [
        { headerCell: 'Registered/Company Name', headerDef: 'companyName' },
        { headerCell: 'Company Type', headerDef: 'companyType' },
        { headerCell: 'Nature of the Business', headerDef: 'natureOfBusiness' },
        { headerCell: 'Segment', headerDef: 'segment' },
        { headerCell: 'Number of Directors', headerDef: 'numberOfDirectors' },
        {
          headerCell: 'Country of Incorporation',
          headerDef: 'countryOfIncorporation',
        },
        {
          headerCell: 'Date of Incorporation',
          headerDef: 'dateOfIncorporation',
        },
        { headerCell: 'Registration Number', headerDef: 'registrationNumber' },
        { headerCell: 'Business Intensity', headerDef: 'businessIntensity' },
        { headerCell: 'Source of Income', headerDef: 'sourceOfIncome' },
        { headerCell: 'TIN Number', headerDef: 'tinNumber' },
        { headerCell: 'Parent Company', headerDef: 'parentCompany' },
      ],
    },
    {
      title: 'Collateral',
      key: 'collateral',
      headerInfo: [
        { headerCell: 'Parent Company', headerDef: 'parentCompany' },
      ],
    },
  ];

  static readonly collateralHeaders = [
    { key: 'collateralName', label: 'Collateral Name' },
    { key: 'ownership', label: 'Ownership of the collateral' },
    { key: 'assetWorth', label: 'Asset Monetary Worth' },
    { key: 'description', label: 'Description of Collateral' },
    { key: 'document', label: 'Document Upload' },
    { key: 'action', label: 'Action' },
  ];

  static readonly tableData = [
    {
      collateralName: 'Credit Card Details',
      ownership: 'Self',
      assetWorth: '3,00,000',
      description:
        'Detailed information regarding the collateral, including usage history.',
    },
    {
      collateralName: 'VAF Details',
      ownership: 'Self',
      assetWorth: '3,00,000',
      description: 'Detailed information regarding vehicle ownership details.',
    },
    {
      collateralName: 'Credit Card Details',
      ownership: 'Self',
      assetWorth: '3,00,000',
      description:
        'Detailed information regarding the collateral, including usage history.',
    },
    {
      collateralName: 'VAF Details',
      ownership: 'Self',
      assetWorth: '3,00,000',
      description: 'Detailed information regarding vehicle ownership details.',
    },
  ];
}
