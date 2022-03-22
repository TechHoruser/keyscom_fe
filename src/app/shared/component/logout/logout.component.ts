import {Component} from '@angular/core';
import {AuthenticationService} from '../../auth/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  email: string;
  password: string;

  constructor(
    public authenticationService: AuthenticationService,
    private route: Router,
  ) {
    authenticationService.currentUser.subscribe((user) => {
      this.route.navigate(['/login']);
    });
    this.authenticationService.logout();
  }
}
