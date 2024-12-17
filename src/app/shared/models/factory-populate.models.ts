export interface FACTORYPOPULATE {
  customerId: number;
  prefix: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  nationality: string;
  contact: {
    mobile: number;
    mobtCode: string;
    email: string;
    address: [
      {
        address1: string;
        residenceType: string;
        countryName: string;
        pincode: number;
        stateName: string;
        cityId: number;
      },
    ];
  };
  source: string;
  kycStatus: string;
  data?: Record<string, object | boolean | null>[];
  statusCode?: number | string;
}
