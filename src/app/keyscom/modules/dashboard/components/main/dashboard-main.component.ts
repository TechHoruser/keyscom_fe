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
  ) {}

  public ngOnInit(): void {
    this.apxSeries = new BehaviorSubject({});
    this.apxSeries.subscribe((data) => this.loadChart(data));
    this.dashboardService.dashboardCards.subscribe((next) => this.cardsValues = next);
    this.dashboardService.dashboardNewEntitiesByDay.subscribe((next) => this.loadChart(next));

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
      formatData[momentDay.day()][this.getWeek(momentDay)] = data[day];
    });

    const series: { name?: string; type?: string; color?: string; data: { x: string, y: number }[] }[] =
      Object.keys(formatData).map((weekdayKey) => {
        const weekdayValue = formatData[weekdayKey];
        const weekdayName = moment().startOf('week').add(weekdayKey, 'days').format('dddd');
        return {
          name: weekdayName[0].toUpperCase() + weekdayName.slice(1).toLowerCase(),
          data: Object.keys(weekdayValue).map((weekKey) => {
            return {
              x: 'W' + weekKey,
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
}
