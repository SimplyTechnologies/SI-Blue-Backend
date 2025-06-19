import { col, fn, Op, where as sequelizeWhere } from 'sequelize';
import { User } from '../models/usersModel';
import { UserActivity } from '../models/userActivity';
interface GetUserActivityOptions {
  page?: number;
  offset?: number;
  search?: string;
  from?: string;
  to?: string;
}
const getUserActivity = async (options: GetUserActivityOptions) => {
  const { page = 1, offset = 25, search, from, to } = options;
  const limit = offset;
  const offsetNum = (page - 1) * limit;
  const include: any[] = [
    {
      model: User,
      as: 'user',
      paranoid: false,
      attributes: ['email', 'firstName', 'lastName', 'avatarPublicId'],
    },
  ];
  const searchConditions: any[] = [];
  if (search?.trim()) {
    const searchTerm = decodeURIComponent(search.trim());
    searchConditions.push({
      [Op.or]: [
        sequelizeWhere(fn('concat', col('firstName'), ' ', col('lastName')), {
          [Op.iLike]: `%${searchTerm}%`,
        }),
        {
          '$user.email$': {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ],
    });
  }
  const dateConditions: any = {};
  if (from) {
    dateConditions[Op.gte] = new Date(from);
  }
  if (to) {
    dateConditions[Op.lte] = new Date(to);
  }

  if (dateConditions[Op.gte] && dateConditions[Op.lte]) {
    searchConditions.push({
      createdAt: dateConditions,
    });
  }

  let where = {};
  if (searchConditions.length > 0) {
    where = searchConditions;
  }
  const found = await UserActivity.findAndCountAll({
    where,
    limit,
    offset: offsetNum,
    order: [['createdAt', 'DESC']],
    include,
    distinct: true,
  });
  return found;
};
export default {
  getUserActivity,
};

