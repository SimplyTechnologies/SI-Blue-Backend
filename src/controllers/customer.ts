import { customerService } from '../services/index.js';

const createCustomer = async (req, res) => {
  try {
    const customerData = req.user;
    await customerService.createCustomer(customerData);
    res.status(201).json({ message: 'Customer created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default { createCustomer };
