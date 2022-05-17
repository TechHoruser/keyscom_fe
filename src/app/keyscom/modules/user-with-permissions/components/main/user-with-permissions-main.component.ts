import {Component, Input, OnInit} from '@angular/core';
import {faBolt, faBriefcase, faServer, faUserTie} from '@fortawesome/free-solid-svg-icons';
import {UserWithPermissionsService} from '../../services/user-with-permissions.service';
import {User} from '../../../../models/user.model';
import {Permission} from '../../../../models/permission.model';
import {UserService} from '../../../user/services/user.service';
import {FormControl, FormGroup} from '@angular/forms';
import {BehaviorSubject, combineLatestWith, debounceTime, distinctUntilChanged} from 'rxjs';
import {StringHelperService} from '../../../shared/services/string-helper.service';
import {MapProjectService} from '../../../project/services/map-project.service';
import {MapClientService} from '../../../client/services/map-client.service';
import {MapMachineService} from '../../../machine/services/map-machine.service';
import {AlertService} from '../../../layout/services/alert.service';

type UsersWithPermissionsMap = Map<string, {
  user: User,
  parentPermissions: Map<string, Permission>,
  childrenPermissions: Map<string, Permission>,
  hasSshPermission: boolean,
  hasAdminPermission: boolean,
}>;

type ChildPermission = {
  route: string,
  type: string,
  relatedEntityType: string,
  name: string,
};

@Component({
  selector: 'app-user-with-permissions-main',
  templateUrl: './user-with-permissions-main.component.html',
  styleUrls: ['./user-with-permissions-main.component.scss'],
})
export class UserWithPermissionsMainComponent implements OnInit
{
  @Input() permissionRelatedEntity: string;
  @Input() permissionRelatedEntityUuid: string;
  userList: BehaviorSubject<User[]>;
  permissionList: BehaviorSubject<Permission[]>;
  usersWithPermissionsMap: UsersWithPermissionsMap;
  childrenPermissions: ChildPermission[];
  faBolt = faBolt;
  faUserTie = faUserTie;
  faBriefcase = faBriefcase;
  faServer = faServer;

  filters: FormGroup;
  private filtersLastRawValue: string;

  constructor(
    private userWithPermissionsService: UserWithPermissionsService,
    private userService: UserService,
    private stringHelperService: StringHelperService,
    private mapClients: MapClientService,
    private mapProjects: MapProjectService,
    private mapMachines: MapMachineService,
    private alertService: AlertService,
  ) {
    this.userList = new BehaviorSubject([]);
    this.permissionList = new BehaviorSubject([]);

    const initializeFilterForm = (): void => {
      this.filters = new FormGroup({
        name: new FormControl(''),
      });

      this.filtersLastRawValue = '';

      this.filters.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged()
        )
        .subscribe(() => {
          const filtersCurrentRawValue = JSON.stringify(this.filters.getRawValue());
          if (this.filtersLastRawValue !== filtersCurrentRawValue) {
            this.updateUsersWithPermissionsMap();
            this.filtersLastRawValue = filtersCurrentRawValue;
          }
        });
    };

    initializeFilterForm();
  }

  ngOnInit(): void {
    this.userService.getUsers()
      .pipe(
        combineLatestWith(this.userWithPermissionsService.getPermissionsRelatedToEntity(
          this.permissionRelatedEntity,
          this.permissionRelatedEntityUuid,
        ))
      )
      .subscribe(([users, permissions]) => {
        this.userList.next(users.results);
        this.permissionList.next(permissions);
      });

    this.permissionList.subscribe(() => this.updateUsersWithPermissionsMap());
  }

  public addPermission(user: User, type: string): void {
    this.userWithPermissionsService.addPermission(
      user.uuid,
      type,
      this.permissionRelatedEntity,
      this.permissionRelatedEntityUuid,
    ).subscribe(() => {
      this.userWithPermissionsService.getPermissionsRelatedToEntity(
        this.permissionRelatedEntity,
        this.permissionRelatedEntityUuid,
      ).subscribe((permissions) => this.permissionList.next(permissions));
    });
  }

  public async showChildrenPermissions(userUuid: string): Promise<void>
  {
    Promise.all([
      this.mapMachines.getMap(),
      this.mapProjects.getMap(),
      this.mapClients.getMap(),
    ]).then(([machinesMap, projectsMap, clientsMap]) => {
      const maps = {
        client: clientsMap,
        project: projectsMap,
        machine: machinesMap,
      };
      this.childrenPermissions = Array.from(this.usersWithPermissionsMap.get(userUuid).childrenPermissions.values())
        .map( permission => ({
          name: maps[permission.permissionRelatedEntity].get(permission.permissionRelatedEntityUuid).name,
          route: `/${permission.permissionRelatedEntity}/${permission.permissionRelatedEntityUuid}`,
          type: permission.userPermissionType,
          relatedEntityType: permission.permissionRelatedEntity,
        }));
    });
  }

  private updateUsersWithPermissionsMap(): void
  {
    const generateFilteredUsersWithPermissionsMap = (): UsersWithPermissionsMap => {
      const usersWithPermissionsMap = new Map();

      const userFilter = this.stringHelperService.normalize(this.filters.controls.name.value);

      this.userList.value.forEach((user) => {
        // Filter by the form field
        if (
          !userFilter
          || this.stringHelperService.contains(user.firstName, userFilter)
          || this.stringHelperService.contains(user.lastName, userFilter)
          || this.stringHelperService.contains(user.email, userFilter)
        ) {
          usersWithPermissionsMap.set(user.uuid, {
            user,
            parentPermissions: new Map<string, Permission>(),
            childrenPermissions: new Map<string, Permission>(),
          });
        }
      });

      return usersWithPermissionsMap;
    };

    const addPermissionsToUsers = (userWithPermissionsMap: UsersWithPermissionsMap): UsersWithPermissionsMap => {
      const sameOrParentRelatedEntities = {
        client: [null, 'client'],
        project: [null, 'client', 'project'],
        machine: [null, 'client', 'project', 'machine'],
      };

      const newUserWithPermissionsMap = new Map(userWithPermissionsMap);
      this.permissionList.value.forEach((permission) => {
        const userWithPermissions = newUserWithPermissionsMap.get(permission.user.uuid);
        if (!userWithPermissions) {
          this.alertService.error($localize`Error on load data please reload the page`);
        }
        if (sameOrParentRelatedEntities[this.permissionRelatedEntity].includes(permission.permissionRelatedEntity)) {
          userWithPermissions.parentPermissions.set(permission.uuid, permission);
          if (permission.userPermissionType === 'ssh') {
            userWithPermissions.hasSshPermission = true;
          } else if (permission.userPermissionType === 'admin') {
            userWithPermissions.hasAdminPermission = true;
          }
        } else {
          userWithPermissions.childrenPermissions.set(permission.uuid, permission);
        }
      });

      return newUserWithPermissionsMap;
    };

    this.usersWithPermissionsMap = addPermissionsToUsers(generateFilteredUsersWithPermissionsMap());
  }
}
