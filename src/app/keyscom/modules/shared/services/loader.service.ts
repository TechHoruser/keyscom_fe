import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private uuidArray: { [uuid: string]: boolean };
  public loading: BehaviorSubject<boolean>;

  constructor() {
    this.uuidArray = {};
    this.loading = new BehaviorSubject<boolean>(true);
  }

  public hideLoader(uuid?: string): void {
    if (uuid) {
      delete this.uuidArray[uuid];
    } else {
      this.uuidArray = {};
    }

    this.loading.next(Object.keys(this.uuidArray).length > 0);
  }

  public showLoader(): string {
    this.loading.next(true);
    const uuid = uuidv4();
    this.uuidArray[uuid] = true;
    return uuid;
  }
}
