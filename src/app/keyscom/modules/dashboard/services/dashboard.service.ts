import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {DASHBOARD_CARD, DASHBOARD_NEW_ENTITIES_BY_DAY} from '../../../api.endpoints';
import {DashboardCards} from '../../../models/dashboard-cards.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  public dashboardCards?: BehaviorSubject<DashboardCards>;
  public dashboardNewEntitiesByDay?: BehaviorSubject<{ [day: string]: number }>;

  constructor(
    private http: HttpClient,
  ) {
    this.dashboardCards = new BehaviorSubject(null);
    this.dashboardNewEntitiesByDay = new BehaviorSubject(null);
  }

  updateCardsValues(): void {
    this.http.get<DashboardCards>(`${environment.API_HOST}${DASHBOARD_CARD}`)
      .subscribe(async res => this.dashboardCards.next(res));
  }

  updateNewEntitiesByDay(type: string): void
  {
    this.http.get<{ [day: string]: number }>(
      `${environment.API_HOST}${DASHBOARD_NEW_ENTITIES_BY_DAY}`,
      { params: {type} },
    )
      .subscribe(async res => this.dashboardNewEntitiesByDay.next(res));
  }
}
