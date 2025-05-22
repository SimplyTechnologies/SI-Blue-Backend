import { User } from '../models/usersModel.js';
const createUser = async (userData) => {
    const user = await User.create({
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone_number: userData.phone_number,
        password: userData.password,
        email: userData.email,
        role: 'user',
    });
    return user.id;
};
const getUserById = async (id) => {
    return await User.findByPk(id, { attributes: { exclude: ['password'] } });
};
const deleteUserById = async (id) => { };
const getAllUsers = async () => {
    return await User.findAll({ attributes: { exclude: ['password'] } });
};
const updateUser = async (updatedData) => { };
const getUserByEmail = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user)
        return null;
    return user;
};
const getUserProfile = async () => { };
export default {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUserById,
    getUserByEmail,
};
//# sourceMappingURL=user.js.map