import { User } from '../models/usersModel';
import { UserActivity } from '../models/userActivity';

const getUserActivity = async (options: { page?: number; offset?: number }) => {
  const { page = 1, offset = 25 } = options;
  const limit = offset;
  const offsetNum = (page - 1) * limit;

  let where = {};

  let include: any[] = [
    {
      model: User,
      as: 'user',
    },
  ];

  return await UserActivity.findAndCountAll({
    where,
    limit,
    offset: offsetNum,
    order: [['createdAt', 'DESC']],
    include,
  });
};

export default {
  getUserActivity,
};

