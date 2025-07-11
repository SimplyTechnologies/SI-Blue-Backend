import { col, fn, Op, where as sequelizeWhere } from 'sequelize';
import { User } from '../models/usersModel';
import { RegisterInput } from '../schemas/usersSchema.js';
export interface InputUser {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}
const createUser = async (userData: RegisterInput) => {
  try {
    if (!userData) {
      throw new Error('User data missing');
    }
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
  } catch (err) {
    console.error('failed to create user', err);
    throw err;
  }
};

const createInactiveUser = async (userData: InputUser) => {
  try {
    if (!userData) {
      throw new Error('User data missing');
    }
    const user = await User.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      isActive: false,
      password: null,
      role: 'user',
    });

    const { password, ...returnedUser } = user.dataValues;
    return returnedUser;
  } catch (err) {
    return new Error('Failed to create user account');
  }
};

const getUserById = async (id: number) => {
  try {
    const user = await User.findOne({ where: { id } });

    return user;
  } catch (err) {
    console.error('Error fetching data', err);
    throw err;
  }
};

const getAllUsers = async (options: { search?: string; page?: number; offset?: number }, currentUserId: number) => {
  const { search, page = 1, offset = 5 } = options;
  const limit = offset;
  const offsetNum = (page - 1) * limit;

  const attributes = { exclude: ['password'] };

  let where = {};
  if (search) {
    where = sequelizeWhere(fn('concat', col('firstName'), ' ', col('lastName')), {
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
  const data = result.filter(u => u.dataValues.id != currentUserId);

  return await { users: data, total, page, pageSize: limit, totalPages: Math.ceil(total / limit) };
};

const updateUser = async (
  id: number,
  updatedData: Partial<Pick<User, 'firstName' | 'lastName' | 'phoneNumber' | 'password' | 'tokenInvalidatedAt'>>,
) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;
    if (updatedData.firstName !== undefined) user.firstName = updatedData.firstName;
    if (updatedData.lastName !== undefined) user.lastName = updatedData.lastName;
    if (updatedData.phoneNumber !== undefined) user.phoneNumber = updatedData.phoneNumber;
    if (updatedData.password !== undefined) user.password = updatedData.password;
    if (updatedData.tokenInvalidatedAt !== undefined) user.tokenInvalidatedAt = updatedData.tokenInvalidatedAt;
    await user.save();

    return user.dataValues;
  } catch (err) {
    console.error('Fail to update user', err);
    throw err;
  }
};

const getUserByEmail = async (email: string, includeDeleted: boolean = false) => {
  try {
    const user = await User.findOne({
      where: { email },
      paranoid: !includeDeleted,
    });

    if (!user) return null;
    return user.dataValues;
  } catch (err) {
    console.error('Error fetching user by email:', err);
    throw err;
  }
};

const softDeleteUser = async (userId: number) => {
  try {
    if (!userId) {
      throw new Error('User id missing');
    }
    const user = await User.findByPk(userId);
    if (!user) {
      throw Error('User not found');
    }
    user.isActive = false;
    user.password = null;
    user.tokenInvalidatedAt = new Date();
    await user.save();
    const deletedRows = await User.destroy({ where: { id: userId } });
    return deletedRows > 0;
  } catch (err) {
    console.error('Error soft deleting user:', err);
    throw err;
  }
};

const restoreUser = async (userId: number) => {
  try {
    if (!userId) {
      throw new Error('User id missing');
    }
    const user = await User.findByPk(userId, { paranoid: false });
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.deletedAt) {
      throw new Error('User is not deleted');
    }

    await user.restore();

    return true;
  } catch (err) {
    console.error('Error restoring user:', err);
    throw err;
  }
};

const updateUserPasswordActiveStatus = async (updatedUser: User) => {
  try {
    if (!updateUser) {
      throw new Error('Updated user data missing ');
    }
    const user = await User.findByPk(updatedUser.id);
    if (!user) return null;

    if (updatedUser.password !== undefined) user.password = updatedUser.password;
    if (updatedUser.isActive !== undefined) user.isActive = updatedUser.isActive;

    await user.save();

    return user.dataValues;
  } catch (err) {
    console.error('Failed to update user');
    throw err;
  }
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  getUserByEmail,
  updateUserPasswordActiveStatus,
  createInactiveUser,
  softDeleteUser,
  restoreUser,
};
