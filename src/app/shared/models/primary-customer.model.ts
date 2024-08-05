export interface PrimaryCustomerInfo {
  customerId: number;
  customerStagingId: number;
  customerNo: string;
  prefixValue: string;
  prefix: number;
  firstName: string;
  middleName: any;
  lastName: string;
  gender: number;
  genderValue: string;
  dateOfBirth: string;
  maritalStatus: number;
  maritalStatusValue: string;
  nationality: string;
  nationalityValue: any;
  residenceStatus: any;
  residenceStatusValue: any;
  kycRefNo: string;
  kycStatus: string;
  userRefNo: any;
  kycCbsRefNo: any;
  icustKycRefNo: any;
  icustCustRefNo: any;
  icustRefNo: string;
  custCbsRefNo: any;
  onboardingStatus: any;
  operationType: any;
  profileId: any;
  primaryCustomer: boolean;
  existingCustomer: any;
  profileUrl: any;
  documentInfo: DocumentInfo[];
  documentInfoModel: any;
  isphoneNumVerified: boolean;
  isEmailVerified: boolean;
  contact: Contact;
  jointCustomerInfo: any;
  biometricVerification: any[];
  documentId: any;
  biometricId: any;
  signatureModel: any;
  source: any;
  pepStatus: any;
  rmId: any;
  agentId: any;
  isTaxResident: any;
  fatcaInfo: any;
  riskFactor: any;
  riskFactorValue: any;
  communicationPhone: any;
  communicationPhoneValue: any;
  rekycIds: any;
  videoVerification: any;
  corporateId: any;
  empNo: any;
  kycGeneratedFromFlex: boolean;
  cifGeneratedFromFlex: boolean;
}

export interface DocumentInfo {
  documentId: number;
  documentName: any;
  documentType: string;
  fileName: string;
  fileType: string;
  documentSide: number;
  verificationType: string;
  fileUrl: string;
  idNumber: any;
  phoneNumber: string;
  documentNumber: string;
  issueDate: any;
  expiryDate: any;
  dob: any;
  documentDesc: any;
  isProofOfAddress: any;
  documentNameValue: any;
  documentNameForChecklist: any;
}

export interface Contact {
  contactId: number;
  telephone: string;
  mobile: string;
  mobtCode: string;
  waptCode: string;
  altCode: string;
  fax: any;
  email: string;
  whatsappNo: string;
  alternativeNumber: string;
  residencePhone: any;
  officePhone: any;
  address: Address[];
}

export interface Address {
  addressId: number;
  address1: string;
  address2: string;
  addressType: any;
  residenceType: number;
  residenceTypeValue: string;
  countryName: string;
  stateName: string;
  cityName: string;
  pincode: string;
  cityId: number;
}
