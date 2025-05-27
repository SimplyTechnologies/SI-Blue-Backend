import { Request, Response } from 'express';
import { modelService } from '../services/index.js';

const getModelsByMakeId = async (req: Request, res: Response) => {
  try {
    const makeId = Number(req.query.makeId);
    if (!makeId) {
      return res.status(400).json({ error: 'makeId is required' });
    }
    const models = await modelService.getModelsByMakeId(makeId);

    const modelsWithoutMakeId = models.map((model: any) => ({
      id: model.id,
      name: model.name,
    }));
    res.json(modelsWithoutMakeId);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default {
  getModelsByMakeId,
};
