import {Component, Input, OnInit} from '@angular/core';
import {faBolt, faBriefcase, faServer, faUserTie} from '@fortawesome/free-solid-svg-icons';
import {UserWithPermissionsService} from '../../services/user-with-permissions.service';
import {User} from '../../../../models/user.model';
import {Permission} from '../../../../models/permission.model';
import {UserService} from '../../../user/services/user.service';
import {FormControl, FormGroup} from '@angular/forms';
import {BehaviorSubject, combineLatestWith, debounceTime, distinctUntilChanged} from 'rxjs';

type UsersWithPermissionsMap = Map<string, {
  user: User,
  parentPermissions: Map<string, Permission>,
  childrenPermissions: Map<string, Permission>,
  hasSshPermission: boolean,
  hasAdminPermission: boolean,
}>;

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
  faBolt = faBolt;
  faUserTie = faUserTie;
  faBriefcase = faBriefcase;
  faServer = faServer;

  filters: FormGroup;
  private filtersLastRawValue: string;

  constructor(
    private userWithPermissionsService: UserWithPermissionsService,
    private userService: UserService,
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

  public showChildrenPermissions(userUuid: string): void
  {

  }

  private updateUsersWithPermissionsMap(): void
  {
    const generateFilteredUsersWithPermissionsMap = (): UsersWithPermissionsMap => {
      const usersWithPermissionsMap = new Map();

      const normalize = (str?: string): string => {
        if (str) {
          return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }
      };

      const userFilter = normalize(this.filters.controls.name.value);

      this.userList.value.forEach((user) => {
        // Filter by the form field
        if (
          !userFilter
          || normalize(user.firstName).includes(userFilter)
          || normalize(user.lastName).includes(userFilter)
          || normalize(user.email).includes(userFilter)
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
        // skip if user is filtered
        const userWithPermissions = newUserWithPermissionsMap.get(permission.user.uuid);
        if (userWithPermissions) {
          if (sameOrParentRelatedEntities[this.permissionRelatedEntity].includes(permission.permissionRelatedEntity)) {
            userWithPermissions.parentPermissions.set(permission.uuid, permission);
          } else {
            userWithPermissions.childrenPermissions.set(permission.uuid, permission);
          }

          if (permission.userPermissionType === 'ssh') {
            userWithPermissions.hasSshPermission = true;
          } else if (permission.userPermissionType === 'admin') {
            userWithPermissions.hasAdminPermission = true;
          }
        }
      });

      return newUserWithPermissionsMap;
    };

    this.usersWithPermissionsMap = addPermissionsToUsers(generateFilteredUsersWithPermissionsMap());
  }
}
