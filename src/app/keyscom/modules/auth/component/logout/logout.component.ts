import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';

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
    authenticationService.currentUser.subscribe(() => {
      this.route.navigate(['/login']);
    });
    this.authenticationService.logout();
  }
}
