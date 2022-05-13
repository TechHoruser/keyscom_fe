import {Injectable} from '@angular/core';
import {Client} from '../../../models/client.model';
import {ClientService} from './client.service';
import {AlertService} from '../../layout/services/alert.service';

@Injectable({ providedIn: 'root' })
export class MapClientService {
  public clients: Map<string, Client>;

  constructor(
    private clientService: ClientService,
    private alertService: AlertService,
  ) {
    this.clients = new Map<string, Client>();
    this.updateClients();
  }

  private updateClients(): void
  {
    this.clients.clear();
    this.clientService.getClients().subscribe(
      (paginationUser) => paginationUser.results.map(
        (client) => this.clients.set(client.uuid, client)
      )
    );
  }

  get(uuid: string): Client {
    const client = this.clients.get(uuid);
    if (!client) {
      this.alertService.error($localize`Client doesn't exist`);
    }
    return client;
  }
}
