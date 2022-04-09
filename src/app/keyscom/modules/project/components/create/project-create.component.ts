import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
})
export class ProjectCreateComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  public saveProject(): void {
    this.router.navigate(['/project']);
  }
}
