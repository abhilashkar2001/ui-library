export const debitFields = (data: any) => ({
  'Card Type': data['cardType'],
  'Daily Limit': data['dailyLimit'],
  'Domestic Limit': data['domesticLimit'],
  'International Limit': data['internationalLimit'],
  'ATM Limit': data['atmLimit'],
  'POS Limit': data['posLimit'],
  'Internet Limit': data['internetLimit'],
});

export const CreditFields = (data: any) => ({
  'Card Type': data['cardType'],
  'Credit Limit': data['creditLimit'],
  'Available Credit Limit': data['availableCreditLimit'],
  'Cash Advance Limit': data['cashAdvanceLimit'],
  'International Limit': data['internationalLimit'],
  'Domestic Limit': data['domesticLimit'],
  'Rewards Program Name': data['rewardsProgramName'],
});
