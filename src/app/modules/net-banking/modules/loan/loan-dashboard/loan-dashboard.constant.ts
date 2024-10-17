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
}