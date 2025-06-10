import { Request, Response } from 'express';
import { makeService } from '../services/index.js';
import { ResponseHandler } from '../handlers/errorHandler.js';

const getAllMakes = async (req: Request, res: Response) => {
  try {
    const makes = await makeService.getAllMakes();
    res.json(makes);
  } catch (err) {
    ResponseHandler.serverError(res, 'Internal server error')
  }
};

export default {
  getAllMakes,
};
