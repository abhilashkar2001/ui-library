import { HeaderModel } from "../loan-services/loan-services/loan-repayment/loan-repayment.store";

export class LoanSummaryStore {
    static readonly customerDetails = [
        {
            header: "customerName",
            details: [
                {
                    headerCell: "Outstanding Amount",
                    headerDef: "outstandingAmt",
                },
                {
                    headerCell: "Total Sanction",
                    headerDef: "totalSanctionAmt",
                },
                {
                    headerCell: "Total Disbursed",
                    headerDef: "totalDisbursedAmt",
                },
                {
                    headerCell: "Re-paid Till Date",
                    headerDef: "repaidAmt",
                },
                {
                    headerCell: "Interest Rate",
                    headerDef: "interestValue",
                },
                {
                    headerCell: "Maturity Date",
                    headerDef: "maturityDate",
                },
            ],
        },
        {
            header: "Repayment",
            details: [
                {
                    headerCell: "Frequency",
                    headerDef: "frequency",
                },
                {
                    headerCell: "Repayment Mode",
                    headerDef: "repaymentMode",
                },
                {
                    headerCell: "Repayment Detail",
                    headerDef: "repaymentDetail",
                },
            ],
        },
        {
            header: "Schedule",
            details: [
                {
                    headerCell: "Next Scheduled Amount",
                    headerDef: "nextScheduleAmt",
                },
                {
                    headerCell: "Next Scheduled Date",
                    headerDef: "nextScheduleDate",
                },
                {
                    headerCell: "Loan Total Tenure",
                    headerDef: "totalTenure",
                },
            ],
        },
    ];

    static readonly loanInfo = ["Tenure", "Disbursed", "Repayment"];

    static TenureDetails: HeaderModel[] = [
        {
            headerCell: "Total Tenure",
            headerDef: "totalTenure",
        },
        {
            headerCell: "Remaining Tenure",
            headerDef: "remTenure",
        },
    ];

    static DisbursedDetails: HeaderModel[] = [
        {
            headerCell: "Total sanction",
            headerDef: "totalSanctionAmt",
        },
        {
            headerCell: "Total Disbursed",
            headerDef: "totalDisbursedAmt",
        },
        {
            headerCell: "Remaining Disbursed",
            headerDef: "remainingDisbursed",
        },
    ];

    static RepaymentDetails: HeaderModel[] = [
        {
            headerCell: "Outstanding Amount",
            headerDef: "outstandingAmt",
        },
        {
            headerCell: "Re-paid Till Date",
            headerDef: "repaidAmt",
        },
    ];

    static readonly chartData = {
        id: 765,
        chart: {
            type: "pie",
            custom: {},
            events: {
                render() {
                    const chart = this,
                        series = chart.series[0];
                    let customLabel = chart.options.chart.custom.label;

                    const x = series?.center[0] + chart.plotLeft,
                        y =
                            series?.center[1] +
                            chart.plotTop -
                            customLabel?.attr("height") / 2;

                    customLabel?.attr({
                        x,
                        y,
                    });
                    // Set font size based on chart diameter
                    customLabel?.css({
                        fontSize: `${series.center[2] / 12}px`,
                    });
                },
            },
        },
        accessibility: {
            point: {
                valueSuffix: "%",
            },
        },
        title: {
            text: "2023 Norway car registrations",
        },
        subtitle: {
            text: 'Source: <a href="https://www.ssb.no/transport-og-reiseliv/faktaside/bil-og-transport">SSB</a>',
        },
        tooltip: {
            pointFormat: "{series.name}: <b>{point.percentage:.0f}%</b>",
        },
        legend: {
            enabled: false,
        },
        plotOptions: {
            series: {
                allowPointSelect: true,
                cursor: "pointer",
                borderRadius: 8,
                showInLegend: true,
            },
        },
        series: [],
        colors: ["#00205C", "#377DFF1D"],
    };
}
