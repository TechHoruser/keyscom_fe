import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string;
  password: string;

  constructor(
    public authenticationService: AuthenticationService,
    private route: Router,
  ) {
    authenticationService.currentUser.subscribe((user) => {
      if (user) {
        this.route.navigate(['/callback']);
      }
    });
  }

  login(): void {
    this.authenticationService.login(this.email, this.password).subscribe();
  }
}
