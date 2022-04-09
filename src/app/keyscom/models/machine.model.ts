import {Project} from './project.model';

export class Machine {
  uuid: string;
  name?: string;
  domain?: string;
  type?: string;
  ip: string;
  project?: Project;
}
