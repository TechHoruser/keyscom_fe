import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {ASSIGMENT_PERMISSION, PERMISSION_RELATED_TO_ENTITY, REVOKE_PERMISSIONS} from '../../../api.endpoints';
import {Permission} from '../../../models/permission.model';

@Injectable({ providedIn: 'root' })
export class UserWithPermissionsService {
  constructor(
    private http: HttpClient,
  ) {}

  getPermissionsRelatedToEntity(
    permissionRelatedEntity: string,
    permissionRelatedEntityUuid: string,
  ): Observable<Permission[]> {
    const options = { params: {
        permissionRelatedEntity,
        permissionRelatedEntityUuid,
    } };

    return this.http.get<Permission[]>(`${environment.API_HOST}${PERMISSION_RELATED_TO_ENTITY}`, options);
  }

  addPermission(
    userUuid: string,
    userPermissionType: string,
    relatedEntity?: string,
    relatedEntityUuid?: string,
  ): Observable<any> {
    return this.http.post<any>(`${environment.API_HOST}${ASSIGMENT_PERMISSION}`, {
      userUuid,
      userPermissionType,
      relatedEntity,
      relatedEntityUuid,
    });
  }

  revokePermissions(
    userUuid: string,
    userPermissionType: string,
    relatedEntity?: string,
    relatedEntityUuid?: string,
  ): Observable<any> {
    return this.http.delete<any>(`${environment.API_HOST}${REVOKE_PERMISSIONS}`, {
      body: {
        userUuid,
          userPermissionType,
          relatedEntity,
          relatedEntityUuid,
      },
    });
  }
}
