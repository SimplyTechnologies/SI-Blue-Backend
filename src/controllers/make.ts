import { Request, Response } from 'express';
import { makeService } from '../services/index.js';

const getAllMakes = async (req: Request, res: Response) => {
  try {
    const makes = await makeService.getAllMakes();
    res.json(makes);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default {
  getAllMakes,
};
