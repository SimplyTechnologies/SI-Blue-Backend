import { Customer } from "../models/customersModel";
import { CustomerSchema } from "../schemas/customersSchema";
 
const createCustomer = async (customerData: CustomerSchema ) => {
  const createdCustomer = {
    vehicleId: customerData.vehicleId,
    firstName: customerData.firstName,
    lastName: customerData.lastName,
    phoneNumber: customerData.phoneNumber,
    email: customerData.email

  }
  const returnedCustomer = await Customer.create(createdCustomer)
  return returnedCustomer.dataValues


};

const getCustomerByEmail = async (email: string) => {
  const customer = await Customer.findOne({ where: { email } });
  if (!customer) return null;
  return customer.dataValues;
};

export default {
  createCustomer,
  getCustomerByEmail,
};
