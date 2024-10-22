import { TabModel } from "app/shared/models/tab-model";
import { TableHeader } from "../send-money/send-money-store";
import { HeaderModel } from "./loan-services/loan-services/loan-repayment/loan-repayment.store";

export class loanServiceStore {
    static readonly serviceTabs: TabModel[] = [
        {
            screenName: "My Loan",
            route: "/loan/dashboard/dashboard",
            src: "assets/images/net-banking/loans/loan-repayment.svg",
            selectedSrc: "assets/images/svg/selected-quick-transfer.svg",
            icon: "view_statement",
            selectedIcon: "selected-payment-icon",
        },
        {
            screenName: "Loan Repayment",
            route: "user/loan/loan-service/loan-repayment",
            src: "assets/images/net-banking/loans/loan-repayment.svg",
            selectedSrc: "assets/images/svg/selected-quick-transfer.svg",
            icon: "loan_repayment",
            selectedIcon: "selected-payment-icon",
        },
        {
            screenName: "Top up loan",
            route: "user/loan/loan-service/loan-topUP",
            src: "assets/images/net-banking/loans/topUp.svg",
            selectedSrc: "assets/images/svg/selected-quick-transfer.svg",
            icon: "topUP",
            selectedIcon: "selected-payment-icon",
        },
        {
            screenName: "Repayment cycle",
            route: "user/loan/loan-service/repayment-cycle",
            src: "assets/images/net-banking/loans/repayment-cycle.svg",
            selectedSrc: "assets/images/svg/selected-quick-transfer.svg",
            icon: "payment-icon",
            selectedIcon: "selected-payment-icon",
        },
        {
            screenName: "E Statement",
            route: "user/loan/loan-service/e-statement",
            src: "assets/images/net-banking/loans/e-statement.svg",
            selectedSrc: "assets/images/svg/selected-quick-transfer.svg",
            icon: "emi-icon",
            selectedIcon: "selected-emi-icon",
        },
        {
            screenName: "Modify Tenure",
            route: "user/loan/loan-service/modify-tenure",
            src: "assets/images/net-banking/loans/modify-tenure.svg",
            selectedSrc: "assets/images/svg/selected-quick-transfer.svg",
            icon: "modify_tenure",
            selectedIcon: "selected-payment-icon",
        },
        {
            screenName: "Disbursement Request",
            route: "user/loan/loan-service/disbursement-request",
            src: "assets/images/net-banking/loans/disbursment-request.svg",
            selectedSrc: "assets/images/svg/selected-quick-transfer.svg",
            icon: "card-summary-icon",
            selectedIcon: "selected-card-summary-icon",
        },
        {
            screenName: "Disbursement Schedule",
            route: "user/loan/loan-service/disbursement-schedule",
            src: "assets/images/net-banking/loans/disbursment-schedule.svg",
            selectedSrc: "assets/images/svg/selected-quick-transfer.svg",
            icon: "autopay-icon",
            selectedIcon: "selected-autopay-icon",
        },
        {
            screenName: "Repayment Schedule",
            route: "user/loan/loan-service/repayment-schedule",
            src: "assets/images/net-banking/loans/repayment-schedule.svg",
            selectedSrc: "assets/images/svg/selected-quick-transfer.svg",
            icon: "autopay-icon",
            selectedIcon: "selected-autopay-icon",
        },
        {
            screenName: "Pre Generated Statement",
            route: "user/loan/loan-service/pre-generated-statement",
            src: "assets/images/net-banking/loans/pre-generated.svg",
            selectedSrc: "assets/images/svg/selected-quick-transfer.svg",
            icon: "bill-cycle-icon",
            selectedIcon: "selected-bill-cycle-icon",
        },
        {
            screenName: "View Statement",
            route: "user/loan/loan-service/view-statement",
            src: "assets/images/net-banking/loans/view-statement.svg",
            selectedSrc: "assets/images/svg/selected-quick-transfer.svg",
            icon: "change-pin-icon",
            selectedIcon: "selected-change-pin-icon",
            skipActionButton: true,
        },
        {
            screenName: "Gold renewal",
            route: "user/loan/loan-service/gold-renewal",
            src: "assets/images/net-banking/loans/gold-renewal.svg",
            selectedSrc: "assets/images/svg/loan-view-statement-icon.svg",
            icon: "change-pin-icon",
            selectedIcon: "selected-change-pin-icon",
            skipActionButton: true,
        },
        {
            screenName: "Request Certificate",
            route: "user/loan/loan-service/request-certificate",
            src: "assets/images/net-banking/loans/request-certificate.svg",
            selectedSrc: "assets/images/svg/loan-request-certificate-icon.svg",
            icon: "emi-details-icon",
            selectedIcon: "selected-emi-details-icon",
        },

        {
            screenName: "Interest Statement",
            route: "user/loan/loan-service/interest-statement",
            src: "assets/images/net-banking/loans/interest-statement.svg",
            selectedSrc: "assets/images/svg/loan-interest-statement-icon.svg",
            icon: "payment-icon",
            selectedIcon: "selected-payment-icon",
        },
        {
            screenName: "Schedule Payment",
            route: "user/loan/loan-service/schedule-payment",
            src: "assets/images/net-banking/loans/schedule-payment.svg",
            selectedSrc: "assets/images/svg/loan-interest-statement-icon.svg",
            icon: "payment-icon",
            selectedIcon: "selected-payment-icon",
        },
    ];
    static readonly applyTabs: TabModel[] = [
        {
            screenName: "Apply Loan",
            route: "",
            src: "assets/images/svg/apply_loan.svg",
            selectedSrc: "assets/images/svg/selected-quick-transfer.svg",
            icon: "payment-icon",
            selectedIcon: "selected-payment-icon",
        },
        {
            screenName: "Tracking",
            route: "",
            src: "assets/images/svg/tracking.svg",
            selectedSrc: "assets/images/svg/selected-quick-transfer.svg",
            icon: "payment-icon",
            selectedIcon: "selected-payment-icon",
        },
    ];

    static readonly loanAccNoArr = [{ label: "1", value: "1" }];
    static readonly frequencyArr = [
        { label: "Daily", value: "Daily" },
        { label: "Weekly", value: "Weekly" },
        { label: "Monthly", value: "Monthly" },
        { label: "Yearly", value: "Yearly" },
    ];
    static readonly formatArr = [
        { label: "PDF", value: "PDF" },
        { label: "EXCEL", value: "EXCEL" },
    ];

    static readonly disbursementList: TableHeader[] = [
        {
            headerDef: "customerName",
            headerCell: "Name",
        },
        {
            headerDef: "sequence",
            headerCell: "Agreement No",
        },
        {
            headerDef: "loanType",
            headerCell: "Loan Type",
        },
        {
            headerDef: "sanctionAmount",
            headerCell: "Sanction Amount",
        },
        {
            headerDef: "totalDisbursedAmount",
            headerCell: "Disbursed Amount",
        },
        {
            headerDef: "totalPendingToDisburse",
            headerCell: "Pending To Disburse",
        },
        {
            headerDef: "disbursalDate",
            headerCell: "Last Disbursed Date",
        },
        {
            headerDef: "currency",
            headerCell: "Currency",
        },
    ];
    static readonly disbursementStatementColumns: TableHeader[] = [
        {
            headerDef: "sequence",
            headerCell: "Sequence",
        },
        {
            headerDef: "date",
            headerCell: "Date",
        },
        {
            headerDef: "disbursedAmount",
            headerCell: "Disbursed Amount",
        },
        {
            headerDef: "pendingtoDisburse",
            headerCell: "Pending to Disburse",
        },
        {
            headerDef: "status",
            headerCell: "Status",
        },
    ];

    static readonly viewStatementHeadings: HeaderModel[] = [
        {
            headerDef: "transactionDate",
            headerCell: "Transaction Date",
        },
        {
            headerDef: "description",
            headerCell: "Description",
        },
        {
            headerDef: "",
            headerCell: "Ref. No",
        },
        {
            headerDef: "dueDate",
            headerCell: "Due Date",
        },
        {
            headerDef: "component",
            headerCell: "Component",
        },
        {
            headerDef: "paidAmount",
            headerCell: "Paid Amount",
        },
        {
            headerDef: "amountDue",
            headerCell: "Amount Due",
        },
        {
            headerDef: "pendingDue",
            headerCell: "Pending Due",
        },
    ];

    static readonly repaymentScheduleDetails: TableHeader[] = [
        {
            headerCell: "Name",
            headerDef: "customerName",
        },
        {
            headerCell: "Agreement No",
            headerDef: "",
        },
        {
            headerCell: "Loan Type",
            headerDef: "loanType",
        },
        {
            headerCell: "Payment Schedule",
            headerDef: "paymentSchedule",
        },
        {
            headerCell: "Completed Schedule",
            headerDef: "completedSchedule",
        },
        {
            headerCell: "Pending Schedule",
            headerDef: "pendingSchedule",
        },
        {
            headerCell: "Sanction Amount ",
            headerDef: "sanctionAmount",
        },
        {
            headerCell: "Frequency",
            headerDef: "frequency",
        },
    ];

    static readonly requestCertificateheadings = [
        "Loan Account",
        "Loan Type",
        "Certificate Type",
        "Action",
    ];
    static readonly requestCertificateDatas = [
        {
            loanAccount: 239872378623,
            loanType: "Personal Loan",
            certificateType: "final Interest Certificate",
        },
        {
            loanAccount: 239872378623,
            loanType: "Home Loan",
            certificateType: "Closure Letter",
        },
    ];


}
