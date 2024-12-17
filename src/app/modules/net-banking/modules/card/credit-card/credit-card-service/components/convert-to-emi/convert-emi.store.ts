import { TableHeader } from 'app/modules/net-banking/modules/send-money/send-money-store';

export class ConvertEmiStore {
  static readonly emiDetails: emiModel[] = [
    {
      value: 'cardNumber',
      label: 'Card Number',
    },
    {
      value: 'cardName',
      label: 'Card Name',
    },
    {
      value: 'noOfItemsSelected',
      label: 'No of items selected',
    },
    {
      value: 'amount',
      label: 'Amount',
    },
    {
      value: '7.20%',
      label: 'Interest Rate',
    },
    {
      value: '20000',
      label: 'Processing Fee',
    },
    {
      value: '',
      label: 'Monthly EMI',
    },
  ];

  static readonly transactionDetailsHeaders: TableHeader[] = [
    {
      headerDef: 'refNo',
      headerCell: 'Ref Number',
    },
    {
      headerDef: 'details',
      headerCell: 'Details',
    },
    {
      headerDef: 'amount',
      headerCell: 'Amount',
    },
    {
      headerDef: 'transactionDate',
      headerCell: 'Transaction Date',
    },
    {
      headerDef: 'convertToEmi',
      headerCell: 'Convert To EMI',
    },
  ];
  static notes = [
    'EMI amount does not include processing fee. Processing fee will be charged only once at the time of EMI conversion and will reflect in your current Credit Card statement.',
    'Foreclosure fee will be charged at 3% on the outstanding principal along with next month interest at the time of foreclosure.',
    'Goods and Services Tax (GST) will be levied at 18% on fees, interest, and other charges.',
    'Cash, fuel, and jewelry transactions are not eligible for conversion into EMI.',
    'Transactions on commercial/business cards will not be converted into EMI.',
  ];
}

export interface emiModel {
  value: string | number;
  label: string;
}
