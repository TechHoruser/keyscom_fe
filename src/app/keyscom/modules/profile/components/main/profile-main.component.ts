import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../../auth/services/authentication.service';
import {UpdateProfileEntity} from '../../../client/shared/update-profile.entity';
import {UserService} from '../../../user/services/user.service';

@Component({
  selector: 'app-profile-main',
  templateUrl: './profile-main.component.html',
  styleUrls: ['./profile-main.component.scss'],
})
export class ProfileMainComponent implements OnInit
{
  form: FormGroup;

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl({value: '', disabled: true}, [
        Validators.required,
      ]),
      firstName: new FormControl('', [
        Validators.required,
      ]),
      lastName: new FormControl('', [
        Validators.required,
      ]),
      pubKey: new FormControl(''),
    });

    this.loadForm();
  }

  loadForm(): void {
    this.userService.getUser(this.authService.currentUserValue.uuid).subscribe(user => {
      this.form.patchValue({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        pubKey: user.pubKey,
      });
    });
  }

  save(): void {
    if (this.form.valid) {
      this.userService.updateProfile(this.form.value as UpdateProfileEntity).subscribe();
    }
  }
}
