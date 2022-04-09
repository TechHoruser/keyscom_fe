import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-machine-create',
  templateUrl: './machine-create.component.html',
  styleUrls: ['./machine-create.component.scss'],
})
export class MachineCreateComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  public saveMachine(): void {
    this.router.navigate(['/machine']);
  }
}
