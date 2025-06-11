import { Op } from 'sequelize';
import { Make } from '../models/carMakesModel';
import { Vehicle } from '../models/vehiclesModel';
import { Customer } from '../models/customersModel';
import { CarModel } from '../models/carModelsModel';
import { CustomerSchema } from '../schemas/customersSchema';

const createCustomer = async (customerData: CustomerSchema) => {
  try {
    if (!customerData) {
      throw new Error('Customer data are required');
    }
    const createdCustomer = {
      vehicleId: customerData.vehicleId,
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      phoneNumber: customerData.phoneNumber,
      email: customerData.email,
    };
    const returnedCustomer = await Customer.create(createdCustomer);
    return returnedCustomer.dataValues;
  } catch (err) {
    console.error('Failed to create customer', err);
    throw err
  }
};

const findCustomerById = async (id: number) => {
  try {
    if (!id) {
      throw new Error('Valid Id is required');
    }
    const customer = await Customer.findByPk(id);
    return customer;
  } catch (err) {
    console.error('Failed to get customer by Id', err);
    throw err;
  }
};

const searchDatabase = async (email: string) => {
  try {
    if (!email) {
      throw new Error('Email is required');
    }
    return await Customer.findAll({
      where: {
        email: {
          [Op.iLike]: `%${email.toLowerCase()}%`,
        },
      },
      limit: 10,
    });
  } catch (err) {
    console.error('Failed to get customers', err);
    throw err;
  }
};

const getCustomerByEmail = async (email: string) => {
  try {
    if (!email) {
      throw new Error('Email is required');
    }
    const customer = await Customer.findOne({ where: { email } });
    if (!customer) return null;
    return customer.dataValues;
  } catch (err) {
    console.error('Failed to get customer by email', err);
    throw err;
  }
};

const getCustomers = async (options: { search?: string; page?: number; offset?: number }) => {
  const { search, page = 1, offset = 25 } = options;
  const limit = offset;
  const offsetNum = (page - 1) * limit;

  let where = {};
  if (search) {
    where = {
      [Op.or]: [{ firstName: { [Op.iLike]: `%${search}%` } }, { lastName: { [Op.iLike]: `%${search}%` } }],
    };
  }

  const total = await Customer.count({ where });

  const result = await Customer.findAndCountAll({
    where,
    limit,
    offset: offsetNum,
    order: [['id', 'DESC']],
    include: [
      {
        model: Vehicle,
        as: 'vehicles',
        required: false,
        attributes: ['id', 'vin', 'year', 'assignedDate'],
        include: [
          {
            model: CarModel,
            as: 'model',
            attributes: ['name'],
            include: [
              {
                model: Make,
                as: 'make',
                attributes: ['name'],
              },
            ],
          },
        ],
      },
    ],
  });

  const customers = result.rows.map((customer: any) => {
    const plainCustomer = customer.get({ plain: true });
    return {
      ...plainCustomer,
      vehicles: (plainCustomer.vehicles || []).map((v: any) => ({
        id: v.id,
        vin: v.vin,
        year: v.year,
        make: v.model?.make?.name || null,
        model: v.model?.name || null,
        assignedDate: v.assignedDate || null,
      })),
    };
  });

  return {
    customers,
    total: result.count,
    page,
    pageSize: limit,
    totalPages: Math.ceil(total / limit),
  };
};

export default {
  getCustomers,
  createCustomer,
  getCustomerByEmail,
  searchDatabase,
  findCustomerById,
};
