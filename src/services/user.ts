import { User } from '../models/usersModel.js';
import { RegisterInput } from '../schemas/usersSchema.js';
export interface InputUser {
  firstName: string;
  lastName: string,
  email: string,
  phoneNumber:string
}
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

const addNewUser = async (userData: InputUser) => {
  console.log(userData)
  const user = await User.create({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phoneNumber: userData.phoneNumber,
    isActive: false,
    password: null,
    role: 'user'
  })

  const { password, ...returnedUser } = user.dataValues;
  return returnedUser;

}

const getUserById = async (id: number) => {
  return await User.findByPk(id, { attributes: { exclude: ['password'] } });
};

const deleteUserById = async (id: number) => {};

const getAllUsers = async () => {
  return await User.findAll({ attributes: { exclude: ['password'] } });
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



export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUserById,
  getUserByEmail,
  addNewUser
};
