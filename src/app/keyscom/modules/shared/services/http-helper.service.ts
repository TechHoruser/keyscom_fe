import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpHelperService {
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
}
