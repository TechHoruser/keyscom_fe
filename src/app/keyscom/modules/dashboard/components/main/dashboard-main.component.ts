import {Component, OnInit, ViewChild} from '@angular/core';
import {ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexTitleSubtitle, ChartComponent} from 'ng-apexcharts';
import moment, {Moment} from 'moment/moment';
import {BehaviorSubject} from 'rxjs';
import {DashboardService} from '../../services/dashboard.service';
import {DashboardCards} from '../../../../models/dashboard-cards.model';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  colors: any;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.scss']
})
export class DashboardMainComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public cardsValues?: DashboardCards;
  public chartOptions: Partial<ChartOptions>;
  private apxSeries: BehaviorSubject<{}>;

  constructor(
    private dashboardService: DashboardService,
  ) {
    this.apxSeries = new BehaviorSubject({});
    this.apxSeries.subscribe(() => this.loadChart());
    this.dashboardService.dashboardCards.subscribe((next) => this.cardsValues = next);
  }

  public ngOnInit(): void {
    this.dashboardService.updateCardsValues();
    // setInterval(() => this.apxSeries.next(this.getSeriesDataEmpty()), 5000);
  }

  private generateData(count, yrange): { x, y }[] {
    let i = 0;
    const series = [];
    while (i < count) {
      const x = 'w' + (i + 1).toString();
      const y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x,
        y
      });
      i++;
    }
    return series;
  }

  private loadChart(): void
  {
    const count = this.getNumberOfWeekByYear();
    this.chartOptions = {
      series: [
        {
          name: 'Sunday',
          data: this.generateData(count, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Saturday',
          data: this.generateData(count, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Friday',
          data: this.generateData(count, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Tuesday',
          data: this.generateData(count, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Wednesday',
          data: this.generateData(count, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Thursday',
          data: this.generateData(count, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Monday',
          data: this.generateData(count, {
            min: 0,
            max: 90
          })
        },
      ],
      chart: {
        height: 350,
        type: 'heatmap'
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#008FFB'],
      title: {
        text: 'New entries details'
      }
    };
  }

  private getSeriesDataEmpty(): {} {
    const numberOfWeeksThisYear = this.getNumberOfWeekByYear();
    const arrayWithWeeksNumber = Array.from({length: numberOfWeeksThisYear}, (_, i) => i + 1);
    const arrayWithWeekdaysNumber = Array.from({length: 7}, (_, i) => i);

    return arrayWithWeekdaysNumber.reduce(
      (weekdayAcc, weekdayCurr) => {
        weekdayAcc[weekdayCurr] = arrayWithWeeksNumber.reduce(
          (weekAcc, weekCurr) => {
            weekAcc[weekCurr] = 0;
            return weekAcc;
          }, {}
        );
        return weekdayAcc;
      }, {}
    );
  }

  private getNumberOfWeekByYear(
    year = moment().year()
  ): number
  {
    let lastDayForLastWeek = moment().set('y', year).endOf('year');
    let hasAdditionalWeek = false;
    while (lastDayForLastWeek.weeks() === 1) {
      hasAdditionalWeek = true;
      lastDayForLastWeek = lastDayForLastWeek.add(-1, 'day');
    }
    return lastDayForLastWeek.weeks() + (hasAdditionalWeek ? 1 : 0);
  }

  private getWeek(date: Moment): number
  {
    return (date.weeks() !== 1 || date.month() !== 11) ? date.weeks() : this.getNumberOfWeekByYear(date.year());
  }

  private initializeHetmapArray(): void
  {

  }
}
