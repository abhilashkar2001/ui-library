import { HeaderModel } from "../loan-repayment/loan-repayment.store";

export class LoanTopUpStore {
    static readonly loanAccountDetails: HeaderModel[] = [
        {
            headerCell: "Loan Amount",
            headerDef: "loanAmount",
        },
        {
            headerCell: "Outstanding Principal",
            headerDef: "outstandPrincpl",
        },
        {
            headerCell: "Duration",
            headerDef: "duration",
        },
        {
            headerCell: "Remaining Installments",
            headerDef: "remainingInstall",
        },
    ];


    static readonly ChartDetails: HeaderModel[] = [
        {
            headerCell: "Current Interest Rate",
            headerDef: "rateOfIntrest",
        },
        {
            headerCell: "Current Maturity",
            headerDef: "currentMaturityDate",
        },
        {
            headerCell: "Current Interest",
            headerDef: "currentInterest",
        },
        {
            headerCell: "New Interest Rate",
            headerDef: "rateOfIntrest",
        },
        {
            headerCell: "New Maturity",
            headerDef: "maturityDate",
        },
        {
            headerCell: "New Interest",
            headerDef: "totalInterest",
        },
    ];
}