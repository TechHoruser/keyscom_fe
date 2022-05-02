import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InternalErrorComponent} from './components/internal-error/internal-error.component';

const routes: Routes = [
  {
    path: '',
    component: InternalErrorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule { }
