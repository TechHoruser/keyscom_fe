import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {v4 as uuidv4} from 'uuid';
import moment, {Moment} from 'moment/moment';

@Injectable({providedIn: 'root'})
export class LoaderService {
  private uuidArray: { [uuid: string]: Moment };
  public loading: BehaviorSubject<boolean>;
  private firstShowMoment: Moment;

  constructor() {
    this.uuidArray = {};
    this.loading = new BehaviorSubject<boolean>(true);
    this.firstShowMoment = moment();
  }

  public hideLoader(uuid?: string, minimumLoaderTime = 600): void {
    if (uuid) {
      delete this.uuidArray[uuid];
    } else {
      this.uuidArray = {};
    }

    if (Object.keys(this.uuidArray).length === 0) {
      const timeToWait = minimumLoaderTime - moment().diff(this.firstShowMoment);

      setTimeout(() => {
        // The next value is not false because is possible that while wait timeout increment the array
        this.loading.next(Object.keys(this.uuidArray).length !== 0);
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
