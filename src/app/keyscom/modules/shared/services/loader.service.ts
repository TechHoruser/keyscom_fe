import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {v4 as uuidv4} from 'uuid';
import moment, {Moment} from 'moment/moment';

const MINIMUM_LOADER_TIME = 400;

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private uuidArray: { [uuid: string]: Moment };
  public loading: BehaviorSubject<boolean>;
  private firstShowMoment: Moment;

  constructor() {
    this.uuidArray = {};
    this.loading = new BehaviorSubject<boolean>(true);
    this.firstShowMoment = moment();
  }

  public hideLoader(uuid?: string): void {
    if (uuid) {
      delete this.uuidArray[uuid];
    } else {
      this.uuidArray = {};
    }

    if (Object.keys(this.uuidArray).length === 0) {
      const timeToWait = MINIMUM_LOADER_TIME - moment().diff(this.firstShowMoment);
      console.log(timeToWait);

      setTimeout(() => {
        this.loading.next(false);
      }, timeToWait);
    }
  }

  public showLoader(): string {
    const uuid = uuidv4();
    const showMoment = moment();
    if (!this.loading.value) {
      this.firstShowMoment = showMoment;
      this.loading.next(true);
    }
    this.uuidArray[uuid] = showMoment;
    return uuid;
  }
}
