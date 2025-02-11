export interface FACTORYPOPULATE {
  customerId: number;
  prefixId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  genderId: string;
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
