export enum FlowType {
  DebitCard = 'debitCard',
  CreditCard = 'creditCard',
}

export class SummaryStore {
  static readonly sections = {
    personalDetails: {
      title: 'Personal Details',
      key: 'personalDetails',
      data: [
        { headerCell: 'CIF Number', headerDef: 'cifNumber' },
        { headerCell: 'First Name', headerDef: 'firstName' },
        { headerCell: 'Last Name', headerDef: 'lastName' },
        { headerCell: 'Date of Birth', headerDef: 'dateOfBirth' },
        { headerCell: 'Gender', headerDef: 'gender' },
        { headerCell: 'Marital Status', headerDef: 'maritalStatus' },
        { headerCell: 'Nationality', headerDef: 'nationality' },
        { headerCell: 'Country of Residence', headerDef: 'countryOfResidence' },
        { headerCell: 'Customer Category', headerDef: 'customerCategory' },
      ],
    },
    identificationDetails: {
      title: 'Identification Details',
      key: 'identificationDetails',
      data: [
        {
          headerCell: 'Identification Number',
          headerDef: 'identificationNumber',
        },
        { headerCell: 'Identification Type', headerDef: 'identificationType' },
        { headerCell: 'Country of Issue', headerDef: 'countryOfIssue' },
        { headerCell: 'Date of Issue', headerDef: 'dateOfIssue' },
        { headerCell: 'Expiry Date', headerDef: 'expiryDate' },
      ],
    },
    contactDetails: {
      title: 'Contact Details',
      key: 'contactDetails',
      data: [
        { headerCell: 'Mobile Number', headerDef: 'mobileNumber' },
        { headerCell: 'Alternate Number', headerDef: 'alternateNumber' },
        { headerCell: 'Whatsapp Number', headerDef: 'whatsappno' },
        { headerCell: 'Email ID', headerDef: 'emailId' },
        { headerCell: 'Telephone (Home)', headerDef: 'telephoneHome' },
        { headerCell: 'Telephone (Work)', headerDef: 'telephoneWork' },
        { headerCell: 'Fax', headerDef: 'fax' },
        { headerCell: 'Statement Via', headerDef: 'statementVia' },
      ],
    },
    address: {
      title: 'Address',
      key: 'address',
      data: [
        { headerCell: 'Address Line 1', headerDef: 'addressLine1' },
        { headerCell: 'Address Line 2', headerDef: 'addressLine2' },
        { headerCell: 'Resident Status', headerDef: 'residentStatus' },
        { headerCell: 'Suburb', headerDef: 'suburb' },
        { headerCell: 'City', headerDef: 'city' },
        { headerCell: 'Postal Code', headerDef: 'postalCode' },
        { headerCell: 'Living Address Since', headerDef: 'livingAddressSince' },
      ],
    },
    spouseDetails: {
      title: 'Spouse Details',
      key: 'spouseDetails',
      data: [
        { headerCell: 'Prefix', headerDef: 'prefix' },
        { headerCell: 'First Name', headerDef: 'firstName' },
        { headerCell: 'Last Name', headerDef: 'lastName' },
        { headerCell: 'Date of Birth', headerDef: 'dateOfBirth' },
        {
          headerCell: 'Spouse Telephone (Home)',
          headerDef: 'spouseTelephoneHome',
        },
        {
          headerCell: 'Spouse Telephone (Work)',
          headerDef: 'spouseTelephoneWork',
        },
        { headerCell: 'Mobile Number', headerDef: 'mobileNumber' },
        { headerCell: 'Email', headerDef: 'email' },
        { headerCell: 'Employee Status', headerDef: 'employeeStatus' },
        { headerCell: 'Net Income', headerDef: 'netIncome' },
      ],
    },
    emergencyContactDetails: {
      title: 'Emergency Contact Details / Next of Kin',
      key: 'emergencyContactDetails',
      data: [
        { headerCell: 'Prefix', headerDef: 'prefix' },
        { headerCell: 'First Name', headerDef: 'firstName' },
        { headerCell: 'Last Name', headerDef: 'lastName' },
        { headerCell: 'Relationship', headerDef: 'relationship' },
        { headerCell: 'Mobile Number', headerDef: 'mobileNumber' },
        { headerCell: 'Alternate Number', headerDef: 'alternateNumber' },
        { headerCell: 'Whatsapp Number', headerDef: 'whatsappNumber' },
        { headerCell: 'Email ID', headerDef: 'emailId' },
        { headerCell: 'Telephone (Home)', headerDef: 'telephoneHome' },
        { headerCell: 'Telephone (Work)', headerDef: 'telephoneWork' },
        { headerCell: 'Fax', headerDef: 'fax' },
        { headerCell: 'Address Line 1', headerDef: 'addressLine1' },
        { headerCell: 'Address Line 2', headerDef: 'addressLine2' },
        { headerCell: 'Resident Status', headerDef: 'residentStatus' },
        { headerCell: 'Suburb', headerDef: 'suburb' },
        { headerCell: 'City', headerDef: 'city' },
        { headerCell: 'Postal Code', headerDef: 'postalCode' },
      ],
    },
    accountDetails: {
      title: 'Account Details',
      key: 'accountDetails',
      data: [
        { headerCell: 'Account Type', headerDef: 'accountType' },
        { headerCell: 'Account Description', headerDef: 'accountDescription' },
        {
          headerCell: 'Business Product Name',
          headerDef: 'businessProductName',
        },
        { headerCell: 'Product Description', headerDef: 'productDescription' },
        { headerCell: 'Account Branch', headerDef: 'accountBranch' },
        { headerCell: 'Account Currency', headerDef: 'accountCurrency' },
        { headerCell: 'Holder Type', headerDef: 'holderType' },
        { headerCell: 'Overdraft Required?', headerDef: 'overdraftRequired' },
        { headerCell: 'Initial Funding?', headerDef: 'initialFunding' },
      ],
    },
    cardServices: {
      title: 'Card Services',
      key: 'cardServices',
      data: [
        { headerCell: 'Card Name', headerDef: 'cardName' },
        { headerCell: 'Account Number', headerDef: 'accountNumber' },
        { headerCell: 'Card Type', headerDef: 'cardType' },
        { headerCell: 'Card Network', headerDef: 'cardNetwork' },
        { headerCell: 'Branch Name', headerDef: 'branchName' },
        { headerCell: 'Bank Code', headerDef: 'bankCode' },
        { headerCell: 'Card Preview', headerDef: 'cardPreview' },
        { headerCell: 'Card Type (Details)', headerDef: 'cardTypeDetails' },
        { headerCell: 'Daily Limit', headerDef: 'dailyLimit' },
        { headerCell: 'Domestic Limit', headerDef: 'domesticLimit' },
        { headerCell: 'International Limit', headerDef: 'internationalLimit' },
        { headerCell: 'ATM Limit', headerDef: 'atmLimit' },
        { headerCell: 'POS Limit', headerDef: 'posLimit' },
        { headerCell: 'Internet Limit', headerDef: 'internetLimit' },
      ],
    },
    paymentDetails: {
      title: 'Payment Details',
      key: 'paymentDetails',
      data: [
        { headerCell: 'Cheque Book Fee', headerDef: 'chequeBookFee' },
        { headerCell: 'M-Pesa Mobile Number', headerDef: 'mpesaMobileNumber' },
        { headerCell: 'Overall Amount', headerDef: 'overallAmount' },
      ],
    },
  };

  static readonly flowSections = {
    [FlowType.DebitCard]: [
      'personalDetails',
      'identificationDetails',
      'contactDetails',
    ],
    [FlowType.CreditCard]: [
      'personalDetails',
      'contactDetails',
      'accountDetails',
      'cardServices',
    ],
  };
}
