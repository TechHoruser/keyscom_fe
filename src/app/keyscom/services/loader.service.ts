import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loading = false;
  constructor() {}

  public hideLoader(): void {
    this.loading = false;
  }

  public showLoader(): void {
    this.loading = true;
  }

  public isLoading(): boolean {
    return this.loading;
  }
}
