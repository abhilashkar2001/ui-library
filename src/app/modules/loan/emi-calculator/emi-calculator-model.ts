export interface EmiCalculationPayload {
  principleAmount: number;
  interestRate: number;
  numberOfMonths: number;
  firstRepaymentDate: string;
}
export interface CustomerCategoryResponse {
  categoryId: number;
  categoryName: string;
}
export interface CustomerCategory {
  categoryId: number;
  categoryName: string;
}

export interface CustomerCategoryResponse {
  statusCode: number;
  status: string;
  data: CustomerCategory[];
  message: string;
}
export interface InterestRateResponse {
  statusCode: number;
  status: string;
  data: number;
  message: string;
}
