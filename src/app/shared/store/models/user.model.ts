export interface User {
  using2FA: boolean;
  agentId: number;
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  enabled: boolean;
  pwdExpiryDate: string;
  intime: string;
  outtime: string;
  levelForUser: string;
  department: string;
  passwordGenerationType: string;
  userType: string;
  otp: boolean;
  googleAuth: boolean;
  mobile: string;
  entityCode: string;
  bankCode: string;
  bankName: string;
  branchCode: string;
  counterNumber: string;
  language: string;
  tillIds: number[];
  roles: Role[];
  biometricIdList: unknown[];
  branchCrncyCode: string;
  corporateCustomerId?: string | number;
}

export interface Role {
  created: string;
  createdBy: string;
  lastUpdated: string;
  lastUpdatedBy: string;
  recordStatus: string;
  authStatus: string;
  oneTimeAuth: string;
  version: number;
  id: number;
  roleName: string;
  roleDescription: string;
  processCycleList: ProcessCycleList[];
  refRoleId: number;
  screens: Screen[];
}

export interface ProcessCycleList {
  created: string;
  createdBy: string;
  lastUpdated: string;
  lastUpdatedBy: string;
  authBy: string;
  authorizedDate: string;
  recordStatus: string;
  authStatus: string;
  oneTimeAuth: string;
  version: number;
  revisionNumber: number;
  revisionTimestamp: string;
  id: number;
  processCycleCode: string;
  processCycleName: string;
  processCycleSequenceList: ProcessCycleSequenceList[];
}

export interface ProcessCycleSequenceList {
  created: string;
  createdBy: string;
  lastUpdated: string;
  lastUpdatedBy: string;
  authBy: string;
  authorizedDate: string;
  recordStatus: string;
  authStatus: string;
  oneTimeAuth: string;
  version: number;
  revisionNumber: number;
  revisionTimestamp: string;
  id: number;
  sequence: number;
  processStage: ProcessStage;
}

export interface ProcessStage {
  created: string;
  createdBy: string;
  lastUpdated: string;
  lastUpdatedBy: string;
  authBy: string;
  authorizedDate: string;
  recordStatus: string;
  authStatus: string;
  oneTimeAuth: string;
  version: number;
  revisionNumber: number;
  revisionTimestamp: string;
  id: number;
  processCode: string;
  processName: string;
  menuIcon: string;
  dataInputSequence: DataInputSequence[];
}

export interface DataInputSequence {
  id: number;
  sequence: number;
  qualified: boolean;
  checklist: Checklist;
  icScreen: IcScreen;
}

export interface Checklist {
  created: string;
  createdBy: string;
  lastUpdated: string;
  lastUpdatedBy: string;
  authBy: string;
  authorizedDate: string;
  recordStatus: string;
  authStatus: string;
  oneTimeAuth: string;
  version: number;
  revisionNumber: number;
  revisionTimestamp: string;
  id: number;
  checklistCode: string;
  checklistDesc: string;
  checklistSequences: ChecklistSequence[];
}

export interface ChecklistSequence {
  created: string;
  createdBy: string;
  lastUpdated: string;
  lastUpdatedBy: string;
  authBy: string;
  authorizedDate: string;
  recordStatus: string;
  authStatus: string;
  oneTimeAuth: string;
  version: number;
  revisionNumber: number;
  revisionTimestamp: string;
  id: number;
  seq: number;
  document: string;
  summary: string;
  mandatoryForNxtStg: boolean;
  mandatoryForApproval: boolean;
  docRequired: boolean;
  documentTypes: string;
}

export interface IcScreen {
  created: string;
  createdBy: string;
  lastUpdated: string;
  lastUpdatedBy: string;
  authBy: string;
  authorizedDate: string;
  recordStatus: string;
  authStatus: string;
  oneTimeAuth: string;
  version: number;
  revisionNumber: number;
  revisionTimestamp: string;
  screenCode: number;
  screenName: string;
  route: string;
  linkType: string;
  language: string;
  profile: Profile;
  description: string;
  menuIcon: string;
  menu: boolean;
}

export interface Profile {
  documentId: number;
  documentName: string;
  documentType: string;
  fileName: string;
  fileType: string;
  documentSide: number;
  verificationType: string;
  fileUrl: string;
  documentNumber: string;
  passportNumber: string;
  issueDate: string;
  expiryDate: string;
  dob: string;
  phoneNumber: string;
}

export interface Screen {
  screenCode: number;
  screenName: string;
  route: string;
  isMenu: boolean;
  linkType: string;
  privileges: Privilege[];
  children: Screen[];
  menuIcon: string;
  description: string;
}

export interface Privilege {
  id: number;
  name: string;
}
