import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {DASHBOARD_CARD} from '../../../api.endpoints';
import {DashboardCards} from '../../../models/dashboard-cards.model';
import {LoaderService} from '../../shared/services/loader.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  public dashboardCards?: BehaviorSubject<DashboardCards>;

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
  ) {
    this.dashboardCards = new BehaviorSubject(null);
  }

  updateCardsValues(): void {
    const loaderUuid1 = this.loaderService.showLoader();

    this.http.get<DashboardCards>(`${environment.API_HOST}${DASHBOARD_CARD}`)
      .subscribe(res => {
        this.dashboardCards.next(res);
        this.loaderService.hideLoader(loaderUuid1);
      });
  }
}
