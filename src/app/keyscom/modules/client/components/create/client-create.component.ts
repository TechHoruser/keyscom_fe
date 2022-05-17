import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ClientService} from '../../services/client.service';
import {CreateClientEntity} from '../../shared/create-client.entity';

@Component({
  selector: 'app-client-create',
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.scss'],
})
export class ClientCreateComponent implements OnInit {
  form: FormGroup;

  constructor(
    private router: Router,
    private clientService: ClientService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void
  {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  public saveClient(): void {
    const validateForm = this.form.valid;
    if (validateForm) {
      this.clientService.createClient(this.getCreateClientEntity())
        .subscribe(() => this.router.navigate(['/client']));
    }
  }

  private getCreateClientEntity(): CreateClientEntity
  {
    const formValues = this.form.getRawValue();

    return formValues as CreateClientEntity;
  }
}
