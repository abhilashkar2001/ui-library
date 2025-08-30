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
  cardId: number | null;
  screenCode: number | null;
  empAndFin: EmpAndFinInfoModel;
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
  cardId: number | null;
  screenCode?: number;
  cardService: CardServiceModel;
}
