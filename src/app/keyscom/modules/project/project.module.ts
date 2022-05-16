import {NgModule} from '@angular/core';
import {ProjectListComponent} from './shared/list/project-list.component';
import {ProjectMainComponent} from './components/main/project-main.component';
import {ProjectCreateComponent} from './components/create/project-create.component';
import {SharedModule} from '../shared/shared.module';
import {ProjectModifyComponent} from './components/modify/project-modify.component';
import {UserWithPermissionsModule} from '../user-with-permissions/user-with-permissions.module';
import {ClientModule} from '../client/client.module';

@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectMainComponent,
    ProjectCreateComponent,
    ProjectModifyComponent,
  ],
  imports: [
    SharedModule,
    UserWithPermissionsModule,
    ClientModule,
  ],
})

export class ProjectModule {}
