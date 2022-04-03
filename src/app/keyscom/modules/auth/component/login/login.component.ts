import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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
    private activatedRoute: ActivatedRoute,
  ) {
    authenticationService.currentUser.subscribe((user) => {
      if (user) {
        this.activatedRoute.queryParams
          .subscribe(params => this.route.navigate([params.returnUrl ?? '']));
      }
    });
  }

  login(): void {
    this.authenticationService.login(this.email, this.password).subscribe();
  }
}
