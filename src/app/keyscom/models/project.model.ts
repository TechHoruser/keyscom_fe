import {Moment} from 'moment/moment';
import {Client} from './client.model';
import {Machine} from './machine.model';

export class Project {
  uuid: string;
  name: string;
  startDate?: Moment;
  endDate?: Moment;
  client?: Client;
  machines?: Machine[];
}
