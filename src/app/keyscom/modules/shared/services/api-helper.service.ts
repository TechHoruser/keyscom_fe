import {Injectable} from '@angular/core';
import {isMoment, Moment} from 'moment/moment';

@Injectable({ providedIn: 'root' })
export class ApiHelperService {
  private readonly DATE_API_FORMAT = 'YYYY-MM-DD';
  private readonly DATE_RANGE_SEPARATOR = '/';

  convertAnyToHttpParams(params: object, isRoot: boolean = true): { [param: string]: string | string[]; }
  {
    const returnParams = {};
    Object.keys(params).forEach(paramKey => {
      const paramValue = params[paramKey];
      paramKey = isRoot ? paramKey : `[${paramKey}]`;
      if (typeof paramValue === 'object') {
        const queryStringArray = this.convertAnyToHttpParams(paramValue, false);
        Object.keys(queryStringArray).forEach(queryStringArrayKey => {
          returnParams[`${paramKey}${queryStringArrayKey}`] = queryStringArray[queryStringArrayKey];
        });
      } else if (Array.isArray(paramValue)) {
        paramValue.forEach((paramSubValue, paramSubValueIndex) => {
          const queryStringArray = this.convertAnyToHttpParams(paramSubValue, false);
          Object.keys(queryStringArray).forEach(queryStringArrayKey => {
            returnParams[`[${paramSubValueIndex}]${queryStringArrayKey}`] = queryStringArray[queryStringArrayKey];
          });
        });
      } else {
        returnParams[paramKey] = paramValue;
      }
    });
    return returnParams;
  }

  convertMomentRangeToFilterString(moment1?: Moment, moment2?: Moment): string
  {
    const momentRange = `${this.getStringFromMoment(moment1)}${this.DATE_RANGE_SEPARATOR}${this.getStringFromMoment(moment2)}`;

    return momentRange !== this.DATE_RANGE_SEPARATOR ? momentRange : this.DATE_RANGE_SEPARATOR;
  }

  getStringFromMoment = (moment?: Moment) => (moment && isMoment(moment)) ? moment.format(this.DATE_API_FORMAT) : '';
}
