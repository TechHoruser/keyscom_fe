import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {KeyscomRoutingModule} from './keyscom-routing.module';
import {SharedModule} from '../shared/shared.module';
import {LayoutComponent} from './layout/layout.component';

@NgModule({
  declarations: [
    LayoutComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    KeyscomRoutingModule
  ],
  exports: [
    KeyscomRoutingModule
  ]
})
export class KeyscomModule {
}
