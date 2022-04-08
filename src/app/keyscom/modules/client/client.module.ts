import {NgModule} from '@angular/core';
import {ClientListComponent} from './shared/list/client-list.component';
import {ClientMainComponent} from './components/main/client-main.component';
import {ClientCreateComponent} from './components/create/client-create.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    ClientListComponent,
    ClientMainComponent,
    ClientCreateComponent,
  ],
  imports: [
    SharedModule,
  ],
})

export class ClientModule {}
