/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error'; // Included with Angular CLI.

const API_PORT = 8080;

export const environment = {
  production: false,
  DEFAULT_PAGINATOR_SIZE: 10,
  DEFAULT_PAGINATOR_SIZE_OPTIONS: [5, 10, 25, 50],
  LANG_DEFAULT: 'sp',
  LANGS_AVAILABLE: ['sp'],
  API_HOST: window.location.protocol + '//' +
    window.location.hostname + ':' +
    (API_PORT ?? window.location.port),
  DATE_FORMAT: 'YYYY-MM-DD',
  DATE_SEPARATOR: '/',
  MATERIAL_DATEPICKER_FORMATS: {
    parse: {
      dateInput: 'DD/MM/YYYY',
    },
    display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'DD/MM/YYYY',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  }
};

