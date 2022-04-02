import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('test');
  }

  public saveUser(): void {
    this.router.navigate(['/user']);
  }
}
