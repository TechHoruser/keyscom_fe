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
import {MatSnackBar} from '@angular/material/snack-bar';

type UsersWithPermissionsMap = Map<string, {
  user: User,
  parentPermissions: Map<string, Permission>,
  permissionsForThisEntity: Map<string, Permission>,
  childrenPermissions: Map<string, Permission>,
  hasSshPermission: boolean,
  hasAdminPermission: boolean,
  selectedTypesForRemove: Map<string, boolean>,
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
    private _snackBar: MatSnackBar,
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
    this.childrenPermissions = [];

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
            permissionsForThisEntity: new Map<string, Permission>(),
            childrenPermissions: new Map<string, Permission>(),
            selectedTypesForRemove: new Map(),
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
          this.alertService.error($localize`Error on load data, please reload the page`);
        }
        if (sameOrParentRelatedEntities[this.permissionRelatedEntity].includes(permission.permissionRelatedEntity)) {
          userWithPermissions.parentPermissions.set(permission.uuid, permission);
          if (permission.permissionRelatedEntity === this.permissionRelatedEntity) {
            userWithPermissions.permissionsForThisEntity.set(permission.uuid, permission);
            userWithPermissions.selectedTypesForRemove.set(permission.userPermissionType, false);
          }
          if (permission.userPermissionType === 'ssh') {
            userWithPermissions.hasSshPermission = true;
          } else if (permission.userPermissionType === 'admin') {
            userWithPermissions.hasAdminPermission = true;
          }
        } else {
          userWithPermissions.childrenPermissions.set(permission.uuid, permission);
          userWithPermissions.selectedTypesForRemove.set(permission.userPermissionType, false);
        }
      });

      return newUserWithPermissionsMap;
    };

    this.usersWithPermissionsMap = addPermissionsToUsers(generateFilteredUsersWithPermissionsMap());
  }

  public selectTypeToRemove($event, userUuid: string, permissionType: string, newStatus: boolean): void
  {
    $event.stopPropagation();
    this.usersWithPermissionsMap.get(userUuid).selectedTypesForRemove.set(permissionType, newStatus);
  }

  public hasRevokePermissionsButton(userUuid: string): boolean
  {
    return this.usersWithPermissionsMap.get(userUuid).selectedTypesForRemove.size > 0;
  }

  public revokePermissions(userUuid: string): void
  {
    const userPermissions = this.usersWithPermissionsMap.get(userUuid);

    const permissionTypes = [];
    Array.from(userPermissions.selectedTypesForRemove.keys()).forEach(
      (permissionType) => {
        if (userPermissions.selectedTypesForRemove.get(permissionType)) {
          permissionTypes.push(permissionType);
        }
      }
    );

    if (permissionTypes.length === 0) {
      this._snackBar.open($localize`You need active the permission type to remove`, $localize`Close`)
      return;
    }

    const permissionType = permissionTypes.length === 1 ? permissionTypes[0] : null;

    this.userWithPermissionsService.revokePermissions(
      userUuid,
      permissionType,
      this.permissionRelatedEntity,
      this.permissionRelatedEntityUuid,
    ).subscribe(() => {
      this.permissionList.next(this.permissionList.value.filter(
        (permission) => {
          const childPermission = userPermissions.childrenPermissions.get(permission.uuid);
          const permissionsForThisEntity = userPermissions.permissionsForThisEntity.get(permission.uuid);

          if (childPermission === undefined && permissionsForThisEntity === undefined) {
            return true;
          }

          if (permissionType === null) {
            return false;
          }

          return permission.userPermissionType !== permissionType;
        }
      ));
    });
  }
}
