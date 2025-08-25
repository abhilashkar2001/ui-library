export interface EmpAndFinInfoModel {
  id: number | null;
  employmentStatusId: number;
  occupation: string;
  industrySectorId: number;
  employerName: string;
  employerActivity: string;
  farmingActivity: string | null;
  estimatedMonthIncomeId: number;
  sourceOfFundsId: number;
  incomeSourceDesc: string;
}

export interface EmpAndFinInfoPayload {
  id: number | null;
  screenCode: number | null;
  empAndFinInfo: EmpAndFinInfoModel;
}

export interface CardServiceModel {
  id: number;
  cardName: string;
  cardTypeId: number;
  cardType: string;
  cardNetworkId: number;
  cardNetwork: string;
  preferredBillingDateId: number;
  preferredBillingDate: string;
  deliveryLocation: boolean;
  addressId: number;
  branchName: string;
  bankCode: string;
}

export interface CardResponse {
  id: number;
  cardService: CardServiceModel;
}

export interface SaveCardDetailsPayload {
  id: number;
  screenCode?: number;
  cardService: CardServiceModel;
}
