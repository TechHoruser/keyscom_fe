import {Directive, OnInit} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[appBindQueryParams]',
})
export class BindQueryParamsDirective implements OnInit {
  constructor(
    private ngControl: NgControl,
  ) {}

  ngOnInit(): void {
    if (location.search) {
      const queryParams = new URLSearchParams(location.search);
      const value = Object.fromEntries(queryParams.entries());
      this.ngControl.control.patchValue(value);
    }
  }
}
