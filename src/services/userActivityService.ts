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
    const fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);
    dateConditions[Op.gte] = fromDate;
  }
  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    dateConditions[Op.lte] = toDate;
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
