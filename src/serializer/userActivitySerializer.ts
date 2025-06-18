import { getUserAvatarUrlFromId } from '../helpers/userAvatarUrlFromId';
import { ActionType, ModelType, UserActivityAttributes } from '../models/userActivity';

interface SerializedUserActivity {
  id: number;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  modelType: ModelType;
  actionType: ActionType;
  previousValue: string;
  currentValue: string;
  createdAt: Date;
}

export interface UserActivityRawAttributes extends UserActivityAttributes {
  user: {
    email: string;
    firstName: string;
    lastName: string;
    avatarPublicId: string;
  };
}

export const serializeUserActivity = (userActivity: UserActivityRawAttributes): SerializedUserActivity => {
  const avatarUrl = getUserAvatarUrlFromId(userActivity.user.avatarPublicId);

  return {
    id: userActivity.id,
    user: {
      email: userActivity.user.email,
      firstName: userActivity.user.firstName,
      lastName: userActivity.user.lastName,
      avatarUrl: avatarUrl || null,
    },
    modelType: userActivity.modelType,
    actionType: userActivity.actionType,
    previousValue: userActivity.previousValue,
    currentValue: userActivity.currentValue,
    createdAt: userActivity.createdAt,
  };
};

export type { SerializedUserActivity };

