import { User } from '../models/usersModel';

const createUser = async userData => {
  const user = await User.create({
    first_name: userData.firstname,
    last_name: userData.lastname,
    phone_number: userData.phonenumber,
    password: userData.password,
    email: userData.email,
  });
};

const getUserById = async id => {
  return await User.findByPk(id, { attributes: { exclude: ['password'] } });
};

const deleteUserById = async id => {};

const getAllUsers = async () => {
  return await User.findAll({ attributes: { exclude: ['password'] } });
};

const updateUser = async updatedData => {};

const getUserByEmail = async email => {
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
