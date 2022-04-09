import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProjectMainComponent} from './components/main/project-main.component';
import {ProjectCreateComponent} from './components/create/project-create.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectMainComponent,
  },
  {
    path: 'create',
    component: ProjectCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
