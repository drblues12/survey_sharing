import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnChanges {

  @Input() numberOfPositiveFeedbacks: number = 0;
  @Input() numberOfNegativeFeedbacks: number = 0;

  chartOptions: any;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChartOptions();
  }

  updateChartOptions(): void {
    const pieChartData = [
      { name: 'Positive feedbacks', value: this.numberOfPositiveFeedbacks },
      { name: 'Negative feedbacks', value: this.numberOfNegativeFeedbacks }
    ];
    this.chartOptions = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      grid: {
        left: 10,
        right: 10,
        bottom: 10,
        top: 10,
        containLabel: true
      },
      textStyle: {
        color: this.getLabelColor()
      },
      series: [
        {
          name: 'Feedbacks',
          type: 'pie',
          radius: '90%',
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          data: pieChartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: true,
            formatter: '{b}: {d}%',
            color: this.getLabelColor()
          },
          labelLine: {
            show: true
          },
          color: ['#4CAF50', '#F44336']
        }
      ]
    };
  }

  getLabelColor(): string {
    const theme: string | null = localStorage.getItem('theme');
    if(theme!=null){
      if(theme=='dark')
        return '#ffffff';
      else
        return '#333333';
    }
    return '#333333';
  }

}
