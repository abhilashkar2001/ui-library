import { TableHeader } from "app/modules/net-banking/modules/send-money/send-money-store";

export class PrepaidRefundStore {
  static readonly columnHeaders: TableHeader[] = [
    {
      headerDef: "fullRefund",
      headerCell: "Full Refund",
    },
    {
      headerDef: "currencyCode",
      headerCell: "Currency",
    },
    {
      headerDef: "currencyUnit",
      headerCell: "Currency Unit",
    },
    {
      headerDef: "balanceAmount",
      headerCell: "Balance Amount",
    },
  ];
}
