import { Injectable } from '@angular/core';
import {UserPermissionsRepository} from '../repository/user-permissions.repository';

@Injectable({
  providedIn: 'root'
})
export class UserPermissionsService {

  constructor(
    private userPermissionsRepository: UserPermissionsRepository
  ) { }

  private async getPermissions(): Promise<string[]> {
    return this.userPermissionsRepository.getPermissionForCurrentUser();
  }

  public async hasPermission(permissionsToCheck: string[]): Promise<boolean> {
    const permissions = await this.getPermissions();
    return permissionsToCheck.some(permission => permissions.includes(permission));
  }

}
