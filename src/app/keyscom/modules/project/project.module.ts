import {NgModule} from '@angular/core';
import {ProjectListComponent} from './shared/list/project-list.component';
import {ProjectMainComponent} from './components/main/project-main.component';
import {ProjectCreateComponent} from './components/create/project-create.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectMainComponent,
    ProjectCreateComponent,
  ],
  imports: [
    SharedModule,
  ],
})

export class ProjectModule {}
