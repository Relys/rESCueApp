import {Component, OnInit, ViewChild} from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

@Component({
  selector: 'app-overview-chart',
  templateUrl: './overview-chart.component.html',
  styleUrls: ['./overview-chart.component.scss'],
})
export class OverviewChartComponent implements OnInit {
  isHighcharts = typeof Highcharts === 'object';

  speedGaugeChart: typeof Highcharts = Highcharts;
  dutyGaugeChart: typeof Highcharts = Highcharts;
  erpmGaugeChart: typeof Highcharts = Highcharts;
  currentGaugeChart: typeof Highcharts = Highcharts;
  batteryGaugeChart: typeof Highcharts = Highcharts;

  public speedGaugeOptions: Highcharts.Options;
  public dutyGaugeOptions: Highcharts.Options;
  public erpmGaugeOptions: Highcharts.Options;
  public currentGaugeOptions: Highcharts.Options;
  public batteryGaugeOptions: Highcharts.Options;

  speedUpdateFlag = false;
  speedData = [0];

  dutyUpdateFlag = false;
  dutyData = [0];

  currentUpdateFlag = false;
  currentData = [0];

  batteryUpdateFlag = false;
  batteryData = [0];

  erpmUpdateFlag = false;
  erpmData = [0];

  gaugeOptions: Highcharts.Options = {
    chart: {
      type: 'gauge',
      width: 165,
      height: 165,
      plotBackgroundColor: null,
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false,
      backgroundColor: 'transparent'
    },
    title: null,
    credits: {
      enabled: false,
    },
    pane: {
      size: '85%',
      startAngle: -150,
      endAngle: 150,
      background: [{
        backgroundColor: {
          linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
          stops: [
            [0, '#FFF'],
            [1, '#333']
          ]
        },
        borderWidth: 0,
        outerRadius: '109%'
      }, {
        backgroundColor: {
          linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
          stops: [
            [0, '#333'],
            [1, '#FFF']
          ]
        },
        borderWidth: 1,
        outerRadius: '107%'
      }, {
        // default background
      }, {
        backgroundColor: '#DDD',
        borderWidth: 0,
        outerRadius: '105%',
        innerRadius: '103%'
      }]
    },
    // the value axis
    yAxis: {
      minorTickInterval: 'auto',
      minorTickWidth: 1,
      minorTickLength: 10,
      minorTickPosition: 'inside',
      minorTickColor: '#666',

      tickPixelInterval: 30,
      tickWidth: 2,
      tickPosition: 'inside',
      tickLength: 10,
      tickColor: '#666',
      labels: {
        step: 2,
        //rotation: 'auto'
      },
    },
    plotOptions: {
      gauge: {
        dataLabels: {
          y: 90,
          x: -1,
          borderWidth: 0,
          useHTML: true
        }
      }
    }
  };

  solidGaugeOptions: Highcharts.Options = {
    chart: {
      type: 'solidgauge',
      height: 110,
      width: 110,
      margin: [0, 0, 40, 0],
      spacingBottom: 0,
      spacingTop: 0,
      spacingLeft: 5,
      spacingRight: 5,
      backgroundColor: 'transparent',
    },
    title: null,
    credits: {
      enabled: false,
    },
    pane: {
      center: ['50%', '85%'],
      size: '100%',
      startAngle: -70,
      endAngle: 70,
      background: [
        {
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
      ]
    },
    exporting: {
      enabled: false
    },
    tooltip: {
      enabled: false
    },
    yAxis: {
      stops: [
        [0.1, '#55BF3B'], // green
        [0.49, '#55BF3B'], // green
        [0.5, '#DDDF0D'], // yellow
        [0.69, '#DDDF0D'], // yellow
        [0.9, '#DF5353'] // red
      ],
      lineWidth: 0,
      tickWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      labels: {
        y: 14,
        distance: 2
      }
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
            y: 14,
          borderWidth: 0,
          useHTML: true
        }
      }
    }
  };

  constructor() {

    this.speedGaugeOptions = Highcharts.merge(this.gaugeOptions, {
      yAxis: {
        min: 0,
        max: 30,
        title: {
          y: 20,
          text: 'km/h'
        },
        plotBands: [{
          from: 0,
          to: 12,
          color: '#55BF3B' // green
        }, {
          from: 12,
          to: 24,
          color: '#DDDF0D' // yellow
        }, {
          from: 24,
          to: 30,
          color: '#DF5353' // red
        }]
      },
      series: [{
        type: 'gauge',
        name: 'Speed',
        data: this.speedData,
        dataLabels: {
          format:
            '<div class="gauge-data-label" style="text-align:center">' +
            '<span style="font-size:16px">{y}<br/></span>' +
            '<span style="font-size:10px;opacity:0.4">&nbsp;</span>' +
            '</div>'
        },      tooltip: {
          valueSuffix: ' km/h'
        }
      }]
    });

    this.dutyGaugeOptions = Highcharts.merge(this.gaugeOptions, {
      yAxis: {
        min: 0,
        max: 100,
        title: {
          y: 20,
          text: '%'
        },
        plotBands: [{
          from: 0,
          to: 60,
          color: '#55BF3B' // green
        }, {
          from: 60,
          to: 80,
          color: '#DDDF0D' // yellow
        }, {
          from: 80,
          to: 100,
          color: '#DF5353' // red
        }]
      },
      series: [{
        type: 'gauge',
        name: 'DutyCycle',
        data: this.dutyData,
        dataLabels: {
          format:
            '<div style="text-align:center">' +
            '<span style="font-size:16px">{y}<br/></span>' +
            '<span style="font-size:10px;opacity:0.4">&nbsp;</span>' +
            '</div>'
        },
        tooltip: {
          valueSuffix: ' %'
        }
      }]
    });

    this.erpmGaugeOptions = Highcharts.merge(this.solidGaugeOptions, {
      yAxis: {
        min: 0,
        max: 10000,
        plotBands: [
          { from: 0, to: 5000, color: 'green', outerRadius: '38', innerRadius: '35'},
          { from: 5000, to: 7000, color: 'yellow', outerRadius: '38', innerRadius: '35'},
          { from: 7000, to: 10000, color: 'red', outerRadius: '38', innerRadius: '35'},
        ]
      },
      series: [{
        type: 'solidgauge',
        name: 'ERPM',
        data: this.erpmData,
        dataLabels: {
          format:
            '<div style="text-align:center">' +
            '<span style="font-size:10px;opacity:0.4"><br/></span>' +
            '<span style="font-size:14px">{y}</span>' +
            '</div>'
        },
        tooltip: {
          valueSuffix: ' km/h'
        }
      }]
    });

    this.batteryGaugeOptions = Highcharts.merge(this.solidGaugeOptions, {
      yAxis: {
        type: 'numeric',
        min: 40,
        max: 52,
        tickPositions: [40, 52],
        stops: [
          [0.1, '#DF5353'], // red
          //[0.24, '#DF5353'], // red
          [0.24, '#DDDF0D'], // yellow
          //[0.48, '#DDDF0D'], // yellow
          [0.9, '#55BF3B'] // green
        ],
        plotBands: [
          { from: 40, to: 42, color: 'red', outerRadius: '38', innerRadius: '35'},
          { from: 42, to: 44, color: 'yellow', outerRadius: '38', innerRadius: '35'},
          { from: 44, to: 52, color: 'green', outerRadius: '38', innerRadius: '35'},
        ]
      },
      series: [{
        type: 'solidgauge',
        name: 'Battery',
        data: this.batteryData,
        dataLabels: {
          format:
            '<div style="text-align:center">' +
            '<span style="font-size:10px;opacity:0.4">V<br/></span>' +
            '<span style="font-size:14px">{y:.1f}</span>' +
            '</div>'
        },
        tooltip: {
          valueSuffix: ' V'
        }
      }]
    });

    this.currentGaugeOptions = Highcharts.merge(this.solidGaugeOptions, {
      yAxis: {
        min: 0,
        max: 100,
        plotBands: [
          { from: 0, to: 50, color: 'green', outerRadius: '38', innerRadius: '35'},
          { from: 50, to: 70, color: 'yellow', outerRadius: '38', innerRadius: '35'},
          { from: 70, to: 100, color: 'red', outerRadius: '38', innerRadius: '35'},
        ]
      },
      series: [{
        type: 'solidgauge',
        name: 'Current',
        data: this.currentData,
        dataLabels: {
          format:
            '<div style="text-align:center">' +
            '<span style="font-size:10px;opacity:0.4">A<br/></span>' +
            '<span style="font-size:14px">{y:.1f}</span>' +
            '</div>'
        },
        tooltip: {
          valueSuffix: ' %'
        }
      }]
    });
  }

  ngOnInit() {
  }

  scale(val, inMin, inMax, outMin, outMax) {
    return (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  updateValue() {
    this.speedData[0] = this.getRandomInt(50);
    this.dutyData[0] = this.getRandomInt(100);
    this.batteryData[0] = this.getRandomInt(50);
    this.currentData[0] = this.getRandomInt(100);
    this.erpmData[0] = this.getRandomInt(10000);
    this.speedUpdateFlag = true;
    this.dutyUpdateFlag = true;
    this.batteryUpdateFlag = true;
    this.currentUpdateFlag = true;
    this.erpmUpdateFlag = true;
  }
}
