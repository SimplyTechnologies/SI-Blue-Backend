import { col, fn, Op, where as sequelizeWhere } from 'sequelize';
import { Readable } from 'stream';
import { User } from '../models/usersModel';
import { RegisterInput } from '../schemas/usersSchema.js';
import { deleteCloudinaryFile } from '../helpers/deleteCloudinaryFile';
import cloudinary from '../configs/cloudinary';
import { SerializedUser, serializeUser } from '../serializer/userSerializer';
import { runInTransaction } from '../helpers/transactionHelpers';
import { getUserAvatarUrlFromId } from '../helpers/userAvatarUrlFromId';



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

  const formattedUsers: SerializedUser[] = data.map(user => serializeUser(user));

  return await { users: formattedUsers, total, page, pageSize: limit, totalPages: Math.ceil(total / limit) };
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
const softDeleteUser = async (userId: number): Promise<boolean> => {
  return runInTransaction(async transaction => {
    if (!userId) throw new Error('User id missing');

    const user = await User.findByPk(userId, { transaction });
    if (!user) throw new Error('User not found');

    user.isActive = false;
    user.password = null;
    user.tokenInvalidatedAt = new Date();
    await user.save({ transaction });

    const deletedRows = await User.destroy({ where: { id: userId }, transaction });
    return deletedRows > 0;
  });
};

const restoreUser = async (userId: number) => {
  return runInTransaction(async transaction => {
    if (!userId) throw new Error('User id missing');

    const user = await User.findByPk(userId, { paranoid: false, transaction });
    if (!user) throw new Error('User not found');

    if (!user.deletedAt) throw new Error('User is not deleted');

    await user.restore({ transaction });

    return true;
  });
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
const uploadUserAvatar = async (userId: number, fileBuffer: Buffer) => {
  return runInTransaction(async transaction => {
    const user = await User.findByPk(userId, { transaction });
    if (!user) throw new Error('User not found');

    const result: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: process.env.CLOUDINARY_AVATARS_FOLDER_NAME,
          resource_type: 'image',
          public_id: `user_${userId}_${Date.now()}`,
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      Readable.from(fileBuffer).pipe(stream);
    });

    user.avatarPublicId = result.public_id;
    await user.save({ transaction });
    if (user.avatarPublicId) {
      await deleteCloudinaryFile(user.avatarPublicId);
    }

    
    user.avatarPublicId = result.public_id;
    await user.save({transaction});

    const avatarUrl = getUserAvatarUrlFromId(user.avatarPublicId);;

    return avatarUrl;
  });
};

const deleteUserAvatar = async (userId: number) => {
  return runInTransaction(async transaction => {
    const user = await User.findByPk(userId, { transaction });
    if (!user) throw new Error('User not found');
    if (!user.avatarPublicId) throw new Error('Avatar not found');
    await deleteCloudinaryFile(user.avatarPublicId);

    user.avatarPublicId = null;
    await user.save({ transaction });
    return null;
  });
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
  uploadUserAvatar,
  deleteUserAvatar,
};
