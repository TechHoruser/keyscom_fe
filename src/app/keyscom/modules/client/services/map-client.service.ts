import {Injectable} from '@angular/core';
import {Client} from '../../../models/client.model';
import {ClientService} from './client.service';
import {AlertService} from '../../layout/services/alert.service';
import {firstValueFrom} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MapClientService {
  private clients: Map<string, Client>;

  constructor(
    private clientService: ClientService,
    private alertService: AlertService,
  ) {}

  private async updateClients(): Promise<void>
  {
    const paginationClient = await firstValueFrom(this.clientService.getClients());
    const newMap = new Map<string, Client>();
    paginationClient.results.map((client) => newMap.set(client.uuid, client));
    this.clients = newMap;
  }

  async get(uuid: string): Promise<Client> {
    if (!this.clients) {
      await this.updateClients();
    }

    const client = this.clients.get(uuid);
    if (!client) {
      this.alertService.error($localize`Client doesn't exist`);
    }
    return Promise.resolve(client);
  }

  async getValues(): Promise<Client[]> {
    if (this.clients === undefined) {
      await this.updateClients();
    }
    return Promise.resolve(Array.from(this.clients.values()));
  }

  async getMap(): Promise<Map<string, Client>> {
    if (this.clients === undefined) {
      await this.updateClients();
    }
    return Promise.resolve(this.clients);
  }

  async isLoaded(): Promise<true> {
    if (this.clients === undefined) {
      await this.updateClients();
    }
    return Promise.resolve(true);
  }
}
