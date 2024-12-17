export interface PrimaryCustomerInfo {
  customerId: number;
  customerStagingId: number;
  customerNo: string;
  prefixValue: string;
  prefix: number;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: number;
  genderValue: string;
  dateOfBirth: string;
  maritalStatus: number;
  maritalStatusValue: string;
  nationality: string;
  nationalityValue: string;
  residenceStatus: any;
  residenceStatusValue: string;
  kycRefNo: string;
  kycStatus: string;
  userRefNo: number;
  kycCbsRefNo: number;
  icustKycRefNo: number;
  icustCustRefNo: number;
  icustRefNo: string;
  custCbsRefNo: number;
  onboardingStatus: any;
  operationType: any;
  profileId: number;
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
  documentId: number;
  biometricId: number;
  signatureModel: any;
  source: any;
  pepStatus: any;
  rmId: number;
  agentId: number;
  isTaxResident: any;
  fatcaInfo: any;
  riskFactor: any;
  riskFactorValue: string;
  communicationPhone: number;
  communicationPhoneValue: string;
  rekycIds: number;
  videoVerification: any;
  corporateId: number;
  empNo: number;
  kycGeneratedFromFlex: boolean;
  cifGeneratedFromFlex: boolean;
}

export interface DocumentInfo {
  documentId: number;
  documentName: string;
  documentType: string;
  fileName: string;
  fileType: string;
  documentSide: number;
  verificationType: string;
  fileUrl: string;
  idNumber: number;
  phoneNumber: string;
  documentNumber: string;
  issueDate: Date;
  expiryDate: Date;
  dob: Date;
  documentDesc: any;
  isProofOfAddress: string;
  documentNameValue: string;
  documentNameForChecklist: string;
}

export interface Contact {
  contactId: number;
  telephone: string;
  mobile: string;
  mobtCode: string;
  waptCode: string;
  altCode: string;
  fax: number;
  email: string;
  whatsappNo: string;
  alternativeNumber: string;
  residencePhone: number;
  officePhone: number;
  address: Address[];
}

export interface Address {
  addressId: number;
  address1: string;
  address2: string;
  addressType: string;
  residenceType: number;
  residenceTypeValue: string;
  countryName: string;
  stateName: string;
  cityName: string;
  pincode: string;
  cityId: number;
}
