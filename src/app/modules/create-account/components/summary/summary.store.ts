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
        { headerCell: 'Disbursement Type', headerDef: 'disbursementTypeValue' },
        { headerCell: 'Account', headerDef: 'internal' },
        {
          headerCell: 'Do you have Internal Account',
          headerDef: 'internalAccount',
        },
        { headerCell: 'Account No', headerDef: 'accountNo' },
        { headerCell: 'Account Holder', headerDef: 'customerName' },
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
        { headerCell: 'Registered/Company Name', headerDef: 'businessName' },
        { headerCell: 'Company Type', headerDef: 'companyTypeValue' },
        {
          headerCell: 'Nature of the Business',
          headerDef: 'natureOfBusinessValue',
        },
        { headerCell: 'Segment', headerDef: 'segmentValue' },
        { headerCell: 'Number of Directors', headerDef: 'noOfDirectors' },
        {
          headerCell: 'Country of Incorporation',
          headerDef: 'countryOfIncorporationName',
        },
        {
          headerCell: 'Date of Incorporation',
          headerDef: 'dateOfIncorporation',
        },
        { headerCell: 'Registration Number', headerDef: 'registrationNumber' },
        { headerCell: 'Business Intensity', headerDef: 'businessIntensity' },
        { headerCell: 'Source of Income', headerDef: 'sourceOfIncomeValue' },
        { headerCell: 'TIN Number', headerDef: 'tinNumber' },
        { headerCell: 'Parent Company', headerDef: 'parentCompanyName' },
      ],
    },
  ];

  static readonly directorDetailsStore: any = [
    {
      title: '',
      key: 'director',
      headerInfo: [
        { headerCell: 'CIF Number', headerDef: 'cifNumber' },
        { headerCell: 'Prefix', headerDef: 'prefixValue' },
        { headerCell: 'First Name', headerDef: 'firstName' },
        { headerCell: 'Last Name', headerDef: 'lastName' },
        { headerCell: 'Position', headerDef: 'positionValue' },
        { headerCell: 'Date of Birth', headerDef: 'dateOfBirth' },
        { headerCell: 'Gender', headerDef: 'genderValue' },
        { headerCell: 'Nationality', headerDef: 'nationality' },
        {
          headerCell: 'Identification Number',
          headerDef: 'documentNumber',
        },
        { headerCell: 'Date Issued', headerDef: 'issueDate' },
        { headerCell: 'Expiry Date', headerDef: 'expiryDate' },
        { headerCell: 'Country of Issued', headerDef: 'countryOfIssue' },
        { headerCell: 'Country of Residence', headerDef: 'countryOfResidence' },
        { headerCell: 'Share Percentage', headerDef: 'sharePercentage' },
        { headerCell: 'Marital Status', headerDef: 'maritalStatusValue' },
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
      title: 'Contact Details',
      key: 'contact',
      headerInfo: [
        { headerCell: 'Mobile No', headerDef: 'mobile' },
        { headerCell: 'Alternate No', headerDef: 'alternativeNumber' },
        { headerCell: 'Whatsapp No', headerDef: 'whatsappNo' },
        { headerCell: 'Email ID', headerDef: 'email' },
        { headerCell: 'Telephone (Home)', headerDef: 'telephone' },
        { headerCell: 'Telephone (Work)', headerDef: 'workTelephone' },
        { headerCell: 'Fax', headerDef: 'fax' },
        { headerCell: 'Statement Via', headerDef: 'statementViaValue' },
        {
          headerCell: 'Address Line 1',
          headerDef: 'address1',
          isAddress: true,
        },
        {
          headerCell: 'Address Line 2',
          headerDef: 'address2',
          isAddress: true,
        },
        {
          headerCell: 'Resident Status',
          headerDef: 'residenceTypeValue',
          isAddress: true,
        },
        { headerCell: 'Suburb', headerDef: 'stateName', isAddress: true },
        { headerCell: 'City', headerDef: 'cityName', isAddress: true },
        { headerCell: 'Postal Code', headerDef: 'pincode', isAddress: true },
        {
          headerCell: 'Living Address Since',
          headerDef: 'livingAddressSince',
          isAddress: true,
        },
      ],
    },
    {
      title: 'Spouse Details',
      key: 'spouse',
      headerInfo: [
        { headerCell: 'Prefix', headerDef: 'prefixValue' },
        { headerCell: 'First Name', headerDef: 'firstName' },
        { headerCell: 'Last Name', headerDef: 'lastName' },
        { headerCell: 'Date of Birth', headerDef: 'dateOfBirth' },
        {
          headerCell: 'Spouse Telephone (Home)',
          headerDef: 'telephone',
          isContact: true,
        },
        {
          headerCell: 'Spouse Telephone (Work)',
          headerDef: 'workTelephone',
          isContact: true,
        },
        { headerCell: 'Mobile No', headerDef: 'mobile', isContact: true },
        { headerCell: 'Email', headerDef: 'email', isContact: true },
        { headerCell: 'Employee Status', headerDef: 'employeeStatusValue' },
        { headerCell: 'Net Income', headerDef: 'netIncome', isCurrency: true },
      ],
    },
    {
      title: 'Emergency Contact Details / Next of Kin',
      key: 'emergency',
      headerInfo: [
        { headerCell: 'Prefix', headerDef: 'prefixValue' },
        { headerCell: 'First Name', headerDef: 'firstName' },
        { headerCell: 'Last Name', headerDef: 'lastName' },
        { headerCell: 'Relationship', headerDef: 'relationshipValue' },
        { headerCell: 'Mobile Number', headerDef: 'mobile', isContact: true },
        {
          headerCell: 'Alternate Number',
          headerDef: 'alternateNumber',
          isContact: true,
        },
        {
          headerCell: 'Whatsapp Number',
          headerDef: 'whatsappNo',
          isContact: true,
        },
        { headerCell: 'Email ID', headerDef: 'email', isContact: true },
        {
          headerCell: 'Telephone (Home)',
          headerDef: 'telephone',
          isContact: true,
        },
        {
          headerCell: 'Telephone (Work)',
          headerDef: 'workTelephone',
          isContact: true,
        },
        { headerCell: 'Fax', headerDef: 'fax', isContact: true },
        {
          headerCell: 'Address Line 1',
          headerDef: 'address1',
          isAddress: true,
        },
        {
          headerCell: 'Address Line 2',
          headerDef: 'address2',
          isAddress: true,
        },
        {
          headerCell: 'Resident Status',
          headerDef: 'residenceTypeValue',
          isAddress: true,
        },
        { headerCell: 'Suburb', headerDef: 'stateName', isAddress: true },
        { headerCell: 'City', headerDef: 'cityName', isAddress: true },
        { headerCell: 'Postal Code', headerDef: 'pincode', isAddress: true },
      ],
    },
  ];

  static readonly collateralHeaders = [
    { key: 'collateralNameValue', label: 'Collateral Name' },
    { key: 'ownership', label: 'Ownership of the collateral' },
    { key: 'assetMonetaryWorth', label: 'Asset Monetary Worth' },
    { key: 'description', label: 'Description of Collateral' },
    { key: 'document', label: 'Document Upload' },
    { key: 'action', label: 'Action' },
  ];

  static readonly AccountDetailsStore = [
    {
      title: 'Account Details',
      key: 'accountDetails',
      headerInfo: [
        {
          headerCell: 'Account Type',
          headerDef: 'accountType',
        },
        { headerCell: 'Account Description', headerDef: 'desc' },
        { headerCell: 'Business Product Name', headerDef: 'interestRate' },
        { headerCell: 'Product Description', headerDef: 'emiAmount' },
        { headerCell: 'Account Branch', headerDef: 'emiInterestPayable' },
        {
          headerCell: 'Account Currency',
          headerDef: 'accountCurrency',
        },
        { headerCell: 'Custom Category', headerDef: 'totalPayableAmount' },
        { headerCell: 'Holder Type', headerDef: 'repaymentFrequency' },
      ],
    },
    {
      title: 'Personal Details',
      key: 'personalDetails',
      headerInfo: [
        {
          headerCell: 'CIF Number',
          headerDef: 'cifNumber',
        },
        { headerCell: 'Prefix', headerDef: 'prefix' },
        { headerCell: 'First Name', headerDef: 'interestRate' },
        { headerCell: 'Last Name', headerDef: 'emiAmount' },
        { headerCell: 'Date of Birth', headerDef: 'emiInterestPayable' },
        {
          headerCell: 'Gender',
          headerDef: 'accountCurrency',
        },
        { headerCell: 'Marital Status', headerDef: 'totalPayableAmount' },
        { headerCell: 'Nationality', headerDef: 'repaymentFrequency' },
        { headerCell: 'County Of Residence', headerDef: 'repaymentFrequency' },
      ],
    },
    {
      title: 'Identification Details',
      key: 'identificationDetails',
      headerInfo: [
        {
          headerCell: 'Identification Number',
          headerDef: 'cifNumber',
        },
        { headerCell: 'Country of Issuance', headerDef: 'prefix' },
        { headerCell: 'Date issue', headerDef: 'interestRate' },
        { headerCell: 'Expiry Date', headerDef: 'emiAmount' },
      ],
    },
    {
      title: 'Document Upload & Personal Identification',
      key: 'documentUpload',
      headerInfo: [
        {
          headerCell: 'Last 6 Months Bank Statement *',
          headerDef: 'parentCompany',
        },
      ],
    },
    {
      title: 'Contact Details',
      key: 'contactDetail',
      headerInfo: [
        { headerCell: 'Mobile No', headerDef: 'disbursementTypeValue' },
        { headerCell: 'Alternate No', headerDef: 'internal' },
        {
          headerCell: 'Whatsapp No',
          headerDef: 'internalAccount',
        },
        { headerCell: 'Email ID', headerDef: 'accountNo' },
        { headerCell: 'Telephone(Home)', headerDef: 'customerName' },
        { headerCell: 'Telephone(work)', headerDef: 'branchName' },
        { headerCell: 'Fax', headerDef: 'fax' },
        { headerCell: 'Statement Via', headerDef: 'branchName' },
      ],
    },
    {
      title: 'Address',
      key: 'address',
      headerInfo: [
        { headerCell: 'Address Line 1', headerDef: 'nationalId' },
        { headerCell: 'Address Line 2', headerDef: 'accountNo' },
        { headerCell: 'Resident Status', headerDef: 'creditStatus' },
        { headerCell: 'Subrub', headerDef: 'nationalId' },
        { headerCell: 'City', headerDef: 'accountNo' },
        { headerCell: 'Postal Code', headerDef: 'creditStatus' },
        { headerCell: 'Living Address Since', headerDef: 'creditStatus' },
      ],
    },
    {
      title: 'Spouse Details',
      key: 'spouseDetails',
      headerInfo: [
        { headerCell: 'Prefix', headerDef: 'nationalId' },
        { headerCell: 'First Name', headerDef: 'accountNo' },
        { headerCell: 'Last Name', headerDef: 'creditStatus' },
        { headerCell: 'Date Of Birth', headerDef: 'nationalId' },
        { headerCell: 'Spouse Telephone(Home)', headerDef: 'accountNo' },
        { headerCell: 'Spouse Telephone(Work)', headerDef: 'creditStatus' },
        { headerCell: 'Mobile No', headerDef: 'creditStatus' },
        { headerCell: 'Email', headerDef: 'creditStatus' },
        { headerCell: 'Employee Status', headerDef: 'creditStatus' },
        { headerCell: 'Net Income', headerDef: 'creditStatus' },
      ],
    },
    {
      title: 'Emergency Contact Details / Next of Kin',
      key: 'emergencyDetails',
      headerInfo: [
        { headerCell: 'Prefix', headerDef: 'businessName' },
        { headerCell: 'First Name', headerDef: 'companyTypeValue' },
        {
          headerCell: 'Last Name',
          headerDef: 'natureOfBusinessValue',
        },
        { headerCell: 'Relationship', headerDef: 'segmentValue' },
        { headerCell: 'Mobile Number', headerDef: 'noOfDirectors' },
        {
          headerCell: 'Alternate Number',
          headerDef: 'countryOfIncorporationName',
        },
        {
          headerCell: 'Whatsapp Number',
          headerDef: 'dateOfIncorporation',
        },
        { headerCell: 'Email ID', headerDef: 'registrationNumber' },
        { headerCell: 'Telephone(Home)', headerDef: 'businessIntensity' },
        { headerCell: 'Telephone(Work)', headerDef: 'sourceOfIncomeValue' },
        { headerCell: 'Fax', headerDef: 'tinNumber' },
        { headerCell: 'Address Line 1', headerDef: 'parentCompanyName' },
        { headerCell: 'Address Line 2', headerDef: 'parentCompanyName' },
        { headerCell: 'Resident Status', headerDef: 'parentCompanyName' },
        { headerCell: 'Subrub', headerDef: 'parentCompanyName' },
        { headerCell: 'City', headerDef: 'parentCompanyName' },
        { headerCell: 'Postal Code', headerDef: 'parentCompanyName' },
      ],
    },
  ];
}
