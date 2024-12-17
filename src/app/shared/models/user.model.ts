export interface User {
  id?: string;
  displayName?: string;
  role?: string;
}

export interface AuthUser {
  using2FA: boolean;
  username: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  notifyPasswordExpiryInDays: number;
  mobile: string;
  branchId: number;
  bankId: number;
  denomRequired: boolean;
  corporateCustomerId: number;
}
