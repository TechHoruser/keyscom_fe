import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-client-create',
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.scss'],
})
export class ClientCreateComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  public saveClient(): void {
    this.router.navigate(['/client']);
  }
}
