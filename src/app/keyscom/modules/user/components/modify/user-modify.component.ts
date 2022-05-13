import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {CreateUserEntity} from '../../shared/create-user.entity';

@Component({
  selector: 'app-user-modify',
  templateUrl: './user-modify.component.html',
  styleUrls: ['./user-modify.component.scss'],
})
export class UserModifyComponent implements OnInit {
  form: FormGroup;
  uuid: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
    });

    this.route.params.subscribe(params => {
      this.uuid = params.uuid;
      this.userService.getUser(this.uuid).subscribe(user => {
        this.form.patchValue({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        });
      });
    });
  }

  public updateUser(): void {
    if (this.form.valid) {
      this.userService.updateUser(this.uuid, this.form.value as CreateUserEntity)
        .subscribe(() => this.router.navigate(['/user']));
    }
  }
}
