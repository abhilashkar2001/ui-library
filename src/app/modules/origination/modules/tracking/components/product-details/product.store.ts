export class ProductConstant {
  static readonly customerInfo = {
    type: 'Personal Details',
    keyPair: [
      { label: 'Prefix', valueKey: 'prefixValue', type: 'personal' },
      { label: 'Name', valueKey: 'firstName', type: 'personal' },
      { label: 'Date Of Birth', valueKey: 'dateOfBirth', type: 'personal' },
      { label: 'Email ID', valueKey: 'email', type: 'personal' },
      { label: 'Mobile No', valueKey: 'mobile', type: 'personal' },
      { label: 'Gender', valueKey: 'genderValue', type: 'personal' },
      { label: 'Nationality', valueKey: 'nationality', type: 'personal' },
    ],
    addressPair: [
      { label: 'Address', valueKey: 'address1', type: 'personal' },
      {
        label: 'Residence Type',
        valueKey: 'residenceTypeValue',
        type: 'personal',
      },
      { label: 'Country', valueKey: 'countryName', type: 'personal' },
      { label: 'Zip Code', valueKey: 'pincode', type: 'personal' },
      { label: 'State', valueKey: 'stateName', type: 'personal' },
      { label: 'City', valueKey: 'cityName', type: 'personal' },
    ],
  };
  static readonly loanDocKeyPair = [
    {
      label: 'Document Type',
      valueKey: 'documentNameForChecklist',
      type: 'document',
    },
  ];
  static readonly docKeyPair = [
    {
      label: 'Document Type',
      valueKey: 'documentNameValue',
      type: 'document',
    },
  ];
  static readonly LoanDynamicKeys = {
    loanAccountInfo: {
      type: 'Loan Details',
      keyPair: [
        { label: 'Loan Amount', valueKey: 'loanAmount', type: 'currency' },
        { label: 'Tenure', valueKey: 'tenure' },
        { label: 'EMI Amount', valueKey: 'emiAmount', type: 'currency' },
        { label: 'Interest Rate', valueKey: 'interestRate' },
        {
          label: 'Interest Payable',
          valueKey: 'interestPayable',
          type: 'currency',
        },
        {
          label: 'Principle Amount',
          valueKey: 'principalAmount',
          type: 'currency',
        },
        {
          label: 'Total Payable Amount',
          valueKey: 'totalPayableAmount',
          type: 'currency',
        },
        { label: 'Holder Type', valueKey: 'holderType' },
        { label: 'Nominee', valueKey: 'nominee' },
      ],
    },

    disbursementDetails: {
      type: 'Disbursement Details',
      keyPair: [
        { label: 'Type', valueKey: 'disbursementTypeValue' },
        { label: 'Account No', valueKey: 'accountNo' },
        { label: 'Name', valueKey: 'customerName' },
        { label: 'EMI Payment Start Date', valueKey: 'emiStartDate' },
      ],
    },
    bankAccount: {
      type: 'Bank Account',
      keyPair: [
        { label: 'Your Account', valueKey: 'yourAccount', type: 'maskText' },
        { label: 'Name', valueKey: 'name' },
        { label: 'Your Pan Card', valueKey: 'nationalId', type: 'maskText' },
      ],
    },
    customerInfo: ProductConstant.customerInfo,
    documnentsInfo: {
      type: 'Loan Documents',
      keyPair: ProductConstant.loanDocKeyPair,
    },
    docs: {
      type: 'KYC Documents',
      keyPair: ProductConstant.docKeyPair,
    },
  };

  static readonly AccountDynamicKeys = {
    customerInfo: ProductConstant.customerInfo,
    docs: {
      type: 'KYC Documents',
      keyPair: ProductConstant.docKeyPair,
    },
  };
}
