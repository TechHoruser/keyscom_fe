import {User} from './user.model';

export class Permission {
  uuid: string;
  permissionRelatedEntityUuid?: string;
  permissionRelatedEntity?: string;
  userPermissionType?: string;
  user: User;
}
