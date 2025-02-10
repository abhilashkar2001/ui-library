export class ChartConstant {
  static readonly COLUMN_DRILLDOWN = {
    id: 3223,
    chart: {
      type: 'column',
    },
    title: {
      text: '',
      align: 'left',
    },
    subtitle: {
      text:
        'Source: <a target="_blank" ' +
        'href="https://www.indexmundi.com/agriculture/?commodity=corn">indexmundi</a>',
      align: 'left',
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'March',
        'April',
        'May',
        'June',
        'Jully',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      crosshair: true,
      accessibility: {
        description: 'Countries',
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: '',
      },
    },
    tooltip: {
      valueSuffix: '',
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [],
  };
}
