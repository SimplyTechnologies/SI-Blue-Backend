import { User } from '../models/usersModel.js';


const createUser = async (userData: User) => {
  const user = await User.create({
    first_name: userData.first_name,
    last_name: userData.last_name,
    phone_number: userData.phone_number,
    password: userData.password,
    email: userData.email,
    role: 'user',
  });
  const {password, ...returnedUser} = user
  return returnedUser
};

const getUserById = async (id: number) => {
  return await User.findByPk(id, { attributes: { exclude: ['password'] } });
};

const deleteUserById = async (id: number) => {};

const getAllUsers = async () => {
  return await User.findAll({ attributes: { exclude: ['password'] } });
};

const updateUser = async (updatedData: User) => {};

const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) return null;
  return user;
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
