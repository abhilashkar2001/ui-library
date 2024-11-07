import { TableHeader } from "../../send-money/send-money-store";
import { loanServiceStore } from "../loan-tabs";


export class LoanDashboardConstant {
    static readonly transactionCard = [
        {
            screenName: "Services",
            childTab: loanServiceStore?.serviceTabs.slice(1, 14),
        },
        {
            screenName: "Apply",
            childTab: loanServiceStore?.applyTabs,
        },
    ];

    static readonly closedLoan = [
        {
            loanImageUrl: "assets/images/closed-loan1.png",
            loanType: "Buisness Loan",
            accNo: "4689 **** **** 6321",
            date: "10 Apr 2021",
        },
        {
            loanImageUrl: "assets/images/closed-loan2.png",
            loanType: " Startup Loan",
            accNo: "4689 **** **** 6321",
            date: "10 Apr 2021",
        },
        {
            loanImageUrl: "assets/images/closed-loan3.png",
            loanType: "Overdraft Loan",
            accNo: "4689 **** **** 6321",
            date: "10 Apr 2021",
        },
    ];

    static readonly instantApproveItems = [
        "Apply For Two Wheeler",
        "Apply For Personal Loan",
        "Apply For Credit Card Loan",
        "Apply For Gold Loan",
        "Apply For Car Loan",
    ];


    static readonly Links = [
        "E Statement",
        "Pre Generated Statement",
        "Nominee Details",
        "Demand Draft Request",
        "New Savings Account",
        "Interest Certificate",
        "Communication Address",
        "Update KYC",
        "Change Home Branch",
        "Update Signature",
        "Cheque Issued",
        "Unclear Transaction",
        "Lien Linked on Account",
    ];


    static readonly recentTabs: string[] = ["Active Loan"];

    static readonly recentColumns: TableHeader[] = [
        {
            headerDef: "created",
            headerCell: "Date",
        },
        {
            headerDef: "cbsRefNo",
            headerCell: "Ref Number",
        },
        {
            headerDef: "remarks",
            headerCell: "Description",
        },
        {
            headerDef: "renewalAmount",
            headerCell: "Amount",
        },
        {
            headerDef: "balance",
            headerCell: "Balance",
        },
    ];


}

