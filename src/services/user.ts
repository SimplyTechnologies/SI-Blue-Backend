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

const getAllUsers = async () => {
  return await User.findAll({ attributes: { exclude: ['password'] } });
};

const updateUser = async (
  id: number,
  updatedData: Partial<Pick<User, 'firstName' | 'lastName' | 'phoneNumber' | 'password'>>,
) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  if (updatedData.firstName !== undefined) user.firstName = updatedData.firstName;
  if (updatedData.lastName !== undefined) user.lastName = updatedData.lastName;
  if (updatedData.phoneNumber !== undefined) user.phoneNumber = updatedData.phoneNumber;
  if (updatedData.password !== undefined) user.password = updatedData.password;
  await user.save();
  const { password, ...userWithoutPassword } = user.dataValues;
  return userWithoutPassword;
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
