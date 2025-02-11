export class CreateLoanConstant {
  static readonly CURRENCY_SYMBOLL = '₹';
  static readonly SCREEN_NAME = 'Create Loan';
  static readonly GENERIC_SATIC_KEYS = {
    HOLDERTYPE: [],
    OWNERSHIP: [],
  };

  static readonly ACCOUNT_TYPE = [
    {
      name: 'Internal Account',
      value: 'internal',
    },
    {
      name: 'External Account',
      value: 'external',
    },
  ];
}
export enum CreateLoanEnum {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
  ACCOUNT_INCLUDES_KEY = 'account',
}
