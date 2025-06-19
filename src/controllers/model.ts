import { Request, Response } from 'express';
import { modelService } from '../services/index.js';
import { ResponseHandler } from '../handlers/errorHandler.js';

const getModelsByMakeId = async (req: Request, res: Response) => {
  try {
    const makeId = Number(req.query.makeId);
    if (!makeId) {
      return ResponseHandler.badRequest(res, 'MakeID is required');
    }
    const models = await modelService.getModelsByMakeId(makeId);

    const modelsWithoutMakeId = models.map((model: any) => ({
      id: model.id,
      name: model.name,
    }));
    ResponseHandler.success(res, 'Models fetched successfully', modelsWithoutMakeId);
  } catch (err) {
    ResponseHandler.serverError(res, 'Internal server error');
  }
};

export default {
  getModelsByMakeId,
};

