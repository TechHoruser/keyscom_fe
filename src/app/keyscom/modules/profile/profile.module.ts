import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {ProfileMainComponent} from './components/main/profile-main.component';

@NgModule({
  declarations: [
    ProfileMainComponent,
  ],
  imports: [
    SharedModule,
  ],
})

export class ProfileModule {}
