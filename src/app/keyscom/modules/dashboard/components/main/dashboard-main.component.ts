import {Component, OnInit} from '@angular/core';
import {ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexTitleSubtitle} from 'ng-apexcharts';
import moment, {Moment} from 'moment/moment';
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
  public cardsValues?: DashboardCards;
  public chartOptions: Partial<ChartOptions>;

  constructor(
    private dashboardService: DashboardService,
  ) {}

  public ngOnInit(): void {
    this.dashboardService.dashboardCards.subscribe((next) => this.cardsValues = next);
    this.dashboardService.dashboardNewEntitiesByDay.subscribe((next) => {
      if (next !== null) {
        this.loadChart(next);
      }
    });

    this.dashboardService.updateCardsValues();
  }

  public showNewEntriesByDay(type: string): void
  {
    this.dashboardService.updateNewEntitiesByDay(type);
  }

  private loadChart(data: { [day: string]: number }): void
  {
    const formatData = this.getSeriesDataEmpty();
    Object.keys(data).map((day) => {
      const momentDay = moment(day);
      if (formatData[momentDay.day()][this.getYearWeekStringFormat(momentDay)] !== undefined) {
        formatData[momentDay.day()][this.getYearWeekStringFormat(momentDay)] = data[day];
      }
    });

    const series: { name?: string; type?: string; color?: string; data: { x: string, y: number }[] }[] =
      Object.keys(formatData).map((weekdayKey) => {
        const weekdayValue = formatData[weekdayKey];
        const weekdayName = moment().startOf('week').add(weekdayKey, 'days').format('dddd');
        return {
          name: weekdayName[0].toUpperCase() + weekdayName.slice(1).toLowerCase(),
          data: Object.keys(weekdayValue).map((weekKey) => {
            return {
              x: 'W' + weekKey.split('-')[1],
              y: Number(weekdayValue[weekKey]),
            };
          }),
        };
      });

    this.chartOptions = {
      series,
      chart: {
        height: 350,
        type: 'heatmap'
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#008FFB'],
      title: {
        text: $localize`New entries details`
      },
    };
  }

  private getSeriesDataEmpty(year = moment().year()): {} {
    const arrayWithWeekdaysNumber = Array.from({length: 7}, (_, i) => i);
    const arrayWithWeeks = this.getWeeksOfTheYear(year);

    return arrayWithWeekdaysNumber.reduce(
      (weekdayAcc, weekdayCurr) => {
        weekdayAcc[weekdayCurr] = arrayWithWeeks.reduce(
          (weekAcc, weekCurr) => {
            weekAcc[weekCurr] = 0;
            return weekAcc;
          }, {}
        );
        return weekdayAcc;
      }, {}
    );
  }

  private getWeeksOfTheYear(year: number): string[]
  {
    let currentDay = moment().set('y', year).startOf('year');
    const lastDay = moment().set('y', year).endOf('year');
    const weekSet = new Set<string>();
    do {
      weekSet.add(this.getYearWeekStringFormat(currentDay));
      currentDay = currentDay.add(1, 'day');
    } while (!currentDay.isSame(lastDay, 'day'));

    return Array.from(weekSet);
  }

  private getYearWeekStringFormat(date: Moment): string
  {
    const year = date.year()
      - (this.isDateInWeekOfPreviousYear(date) ? 1 : 0)
      + (this.isDateInWeekOfNextYear(date) ? 1 : 0);

    return `${year}-${date.weeks()}`;
  }

  private isDateInWeekOfPreviousYear(date: Moment): boolean
  {
    return (date.month() === 0 && date.weeks() > 50);
  }

  private isDateInWeekOfNextYear(date: Moment): boolean
  {
    return (date.month() === 11 && date.weeks() === 1);
  }
}
