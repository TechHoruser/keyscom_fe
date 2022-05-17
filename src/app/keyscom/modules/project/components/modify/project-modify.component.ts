import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {faUserTie} from '@fortawesome/free-solid-svg-icons';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProjectService} from '../../services/project.service';
import {CreateProjectEntity} from '../../shared/create-project.entity';
import {Project} from '../../../../models/project.model';

@Component({
  selector: 'app-project-modify',
  templateUrl: './project-modify.component.html',
  styleUrls: ['./project-modify.component.scss'],
})
export class ProjectModifyComponent implements OnInit {
  form: FormGroup;
  uuid: string;
  project?: Project;
  faUserTie = faUserTie;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
      ]),
    });

    this.route.params.subscribe(params => {
      this.uuid = params.uuid;
      this.projectService.getProject(this.uuid, ['client']).subscribe(project => {
        this.form.patchValue({name: project.name});
        this.project = project;
      });
    });
  }

  public updateProject(): void {
    if (this.form.valid) {
      this.projectService.updateProject(this.uuid, this.form.value as CreateProjectEntity)
        .subscribe(() => this.router.navigate(['/project']));
    }
  }
}
