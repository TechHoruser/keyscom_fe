import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {STORAGE_LAST_URL} from '../../auth/auth.guard';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor(
    private route: Router
  ) { }

  ngOnInit(): void {
    const lastUrl = localStorage.getItem(STORAGE_LAST_URL) ?? '/';
    this.route.navigate([lastUrl]);
  }
}
