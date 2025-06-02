import { Op, Transaction } from 'sequelize';
import { Customer } from '../models/customersModel';
import { CustomerSchema } from '../schemas/customersSchema';

const createCustomer = async (customerData: CustomerSchema) => {
  const createdCustomer = {
    vehicleId: customerData.vehicleId,
    firstName: customerData.firstName,
    lastName: customerData.lastName,
    phoneNumber: customerData.phoneNumber,
    email: customerData.email,
  };
  const returnedCustomer = await Customer.create(createdCustomer);
  return returnedCustomer.dataValues;
};
const searchDatabase = async (email: string) => {
  return await Customer.findAll({
    where: {
      email: {
        [Op.iLike]: `%${email.toLowerCase()}%`,
      },
    },
    limit: 10,
  });
};

const getCustomerByEmail = async (email: string) => {
  const customer = await Customer.findOne({ where: { email } });
  if (!customer) return null;
  return customer.dataValues;
};

const findCustomerById = async (id: number) => {
  const customer = await Customer.findByPk(id);
  return customer;
};

export default {
  createCustomer,
  getCustomerByEmail,
  searchDatabase,
  findCustomerById,
};
