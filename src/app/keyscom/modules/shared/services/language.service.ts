import {Injectable} from '@angular/core';

@Injectable()
export class LanguageService {
  readonly DEFAULT_LANGUAGE: string = 'en';
  readonly SUPPORTED_LANGUAGES: string[] = ['en', 'es'];

  constructor() {}

  getLanguage(): string {
    const deviceLanguage = window?.navigator.language?.substring(0, 2);

    return this.SUPPORTED_LANGUAGES.includes(deviceLanguage) ? deviceLanguage : this.DEFAULT_LANGUAGE;
  }
}
