import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ClientService} from '../../services/client.service';
import {CreateClientEntity} from '../../shared/create-client.entity';

@Component({
  selector: 'app-client-modify',
  templateUrl: './client-modify.component.html',
  styleUrls: ['./client-modify.component.scss'],
})
export class ClientModifyComponent implements OnInit {
  form: FormGroup;
  uuid: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
      ]),
    });

    this.route.params.subscribe(params => {
      this.uuid = params.uuid;
      this.clientService.getClient(this.uuid).subscribe(client => {
        this.form.patchValue({name: client.name});
      });
    });
  }

  public updateClient(): void {
    if (this.form.valid) {
      this.clientService.updateClient(this.uuid, this.form.value as CreateClientEntity)
        .subscribe(() => this.router.navigate(['/client']));
    }
  }
}
