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

  constructor() {
    this.uuidArray = {};
    this.loading = new BehaviorSubject<boolean>(true);
  }

  public async hideLoader(uuid?: string): Promise<void> {
    let momentWhenCreateLoader: Moment;
    if (uuid) {
      if (this.uuidArray[uuid] !== undefined) {
        momentWhenCreateLoader = this.uuidArray[uuid];
        delete this.uuidArray[uuid];
      }
    } else {
      Object.values(this.uuidArray).forEach(
        (createdMoment) => {
          momentWhenCreateLoader = (
            (momentWhenCreateLoader !== undefined && momentWhenCreateLoader.diff(createdMoment) < 0) ?
              momentWhenCreateLoader : createdMoment
          );
        }
      );
      this.uuidArray = {};
    }

    let timeToWait = MINIMUM_LOADER_TIME;
    if (momentWhenCreateLoader !== undefined) {
      const lapsedTimeBetweenCreationLoading = moment().diff(momentWhenCreateLoader);
      timeToWait = MINIMUM_LOADER_TIME - lapsedTimeBetweenCreationLoading;
    }

    setTimeout(() => {
      const newValue = Object.keys(this.uuidArray).length > 0;
      if (this.loading.value !== newValue) {
        this.loading.next(newValue);
      }
    }, timeToWait);
  }

  public showLoader(): string {
    this.loading.next(true);
    const uuid = uuidv4();
    this.uuidArray[uuid] = moment();
    return uuid;
  }
}
