import { col, fn, Op, where as sequelizeWhere } from 'sequelize';
import { User } from '../models/usersModel.js';
import { RegisterInput } from '../schemas/usersSchema.js';

const createUser = async (userData: RegisterInput) => {
  const user = await User.create({
    firstName: userData.firstName,
    lastName: userData.lastName,
    phoneNumber: userData.phoneNumber,
    password: userData.password,
    email: userData.email,
    role: userData.role == 'superadmin' ? 'superadmin' : 'user',
    isActive: true,
  });
  const { password, ...returnedUser } = user.dataValues;
  return returnedUser;
};

const getUserById = async (id: number) => {
  return await User.findByPk(id, { attributes: { exclude: ['password'] } });
};

const deleteUserById = async (id: number) => {};

const getAllUsers = async (options: { search?: string; page?: number; offset?: number }) => {
  const { search, page = 1, offset = 5 } = options;
  const limit = offset;
  const offsetNum = (page - 1) * limit;

  const attributes = { exclude: ['password'] };

  let where = {};
  if (search) {
    where = sequelizeWhere(fn('concat', col('first_name'), ' ', col('last_name')), {
      [Op.iLike]: `%${search}%`,
    });
  }

  const total = await User.count({ where });

  const result = await User.findAll({
    attributes,
    where,
    limit,
    offset: offsetNum,
    order: [['id', 'DESC']],
  });
  return await { users: result, total, page, pageSize: limit, totalPages: Math.ceil(total / limit) };
};

const updateUser = async (updatedData: User) => {
  await User.update(updatedData, {
    where: { id: updatedData.id },
  });
};

const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) return null;
  return user.dataValues;
};

const getUserProfile = async () => {};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUserById,
  getUserByEmail,
};
