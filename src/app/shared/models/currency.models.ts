export interface CURRENCY {
  code: string;
  symbol: string;
  thousandsSeparator: string;
  decimalSeparator: string;
  symbolOnLeft: boolean;
  spaceBetweenAmountAndSymbol: boolean;
  decimalDigits: number;
}

export type CurrencyList = {
  [key: string]: CURRENCY;
};
