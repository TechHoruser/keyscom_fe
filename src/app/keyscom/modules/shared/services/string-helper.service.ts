import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StringHelperService {
  normalize(str?: string): string
  {
    if (str) {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
  }

  contains(haystack?: string, str?: string): boolean
  {
    if (!str) {
      return true;
    }

    if (!haystack) {
      return false;
    }

    return this.normalize(haystack).includes(this.normalize(str));
  }
}
