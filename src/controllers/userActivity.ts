import { Request, Response } from 'express';
import { ResponseHandler } from '../handlers/errorHandler';
import userActivityService from '../services/userActivityService';

const getUserActivity = async (req: Request, res: Response) => {
  try {
    const { page, offset } = req.query;
    const pageNum = page ? Math.max(Number(page), 1) : 1;
    const limit = offset ? Number(offset) : 25;
    const { rows, count } = await userActivityService.getUserActivity({
      page: pageNum,
      offset: limit,
    });

    ResponseHandler.success(res, 'Customers data retrieved successfully', {
      userActivity: rows,
      previousId: pageNum === 1 ? null : pageNum - 1,
      nextId: Math.ceil(count / limit) > pageNum ? pageNum + 1 : null,
    });
  } catch (err) {
    ResponseHandler.serverError(res, 'Internal server error');
  }
};

export default {
  getUserActivity,
};

