export interface AspectLending {
  lendingId: number;
  productId: number;
  employmentType: number;
  employmentTypeValue: string;
  minimumExperience: number;
  maximumExperience: number;
  minimumNetMonthlyIncome: number;
  maximumEmiPercentage: any;
  minimumCreditScore: number;
  ltvRatio: number;
  foirRatio: number;
  eligibilityCalculationId: any;
  eligibilityCalculationValue: any;
  qualitativeScoreId: number;
  quantitativeId: number;
  creditAgencyId: any;
  creditAgencyValue: any;
  lendingParameters: LendingParameter[];
}

export interface LendingParameter {
  id: number;
  currency: string;
  currencyType: string;
  minimumTenorYear: number;
  minimumTenorMonth: number;
  minimumTenorDay: number;
  maximumTenorYear: number;
  maximumTenorMonth: number;
  maximumTenorDay: number;
  minimumAmount: number;
  maximumAmount: number;
  partialDisbursement: boolean;
  moratoriumAllowed: boolean;
  interestRatefromCustomerLevel: boolean;
  interestRateAmendment: boolean;
  minRateVariancePercentage: any;
  maxRateVariancePercentage: any;
  interestRateMarginforWomen: any;
  interestRateMarginforOthers: any;
  creditScore: number;
  margin: number;
  installmentTypeId: number;
  installmentTypeValue: string;
}

export type AspectLendings = AspectLending[];
export type LendingParameters = LendingParameter[];
