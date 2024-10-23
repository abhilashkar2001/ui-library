export class ChartStore {
    static readonly chartData = {
        chart: {
            type: "column",
            backgroundColor: "transparent",
        },
        title: {
            text: "FD/RD Calculator",
            align: "left",
        },
        xAxis: {
            categories: [],
        },
        yAxis: {
            min: 0,
            title: {
                text: "",
            },
            labels: {
                enabled: false,
            },
            gridLineWidth: 0,
        },
        tooltip: {
            pointFormat:
                '<span style="color:#00205c"><b>{series.name}</b></span>' +
                ": <b>{point.percentage:.0f}%</b>&nbsp;",
            shared: true,
        },
        plotOptions: {
            column: {
                borderRadius: "12px",
                shadow: {
                    offsetX: 0,
                    offsetY: 0,
                    opacity: 0.01,
                    width: 10,
                },
                stacking: "normal",
                dataLabels: {
                    enabled: false,
                    format: "{point.percentage:.0f}%",
                },
            },
        },
        series: [],
    };
}