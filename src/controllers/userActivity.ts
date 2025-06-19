import { Request, Response } from 'express';
import { ResponseHandler } from '../handlers/errorHandler';
import userActivityService from '../services/userActivityService';
import { serializeUserActivity, UserActivityRawAttributes } from '../serializer/userActivitySerializer';

const getUserActivity = async (req: Request, res: Response) => {
  try {
    const { page, offset, search, from, to } = req.query;
    const pageNum = page ? Math.max(Number(page), 1) : 1;
    const limit = offset ? Number(offset) : 25;
    const searchTerm = search ? String(search) : undefined;
    const fromDate = from ? String(from) : undefined;
    const toDate = to ? String(to) : undefined;

    const { rows, count } = await userActivityService.getUserActivity({
      page: pageNum,
      offset: limit,
      search: searchTerm,
      from: fromDate,
      to: toDate,
    });

    const userActivity = rows.map(row => serializeUserActivity(row as UserActivityRawAttributes));

    ResponseHandler.success(res, 'Customers data retrieved successfully', {
      userActivity,
      previousId: pageNum === 1 ? null : pageNum - 1,
      nextId: Math.ceil(count / limit) > pageNum ? pageNum + 1 : null,
    });
  } catch (err) {
    console.error('Error retrieving user activity:', err);
    ResponseHandler.serverError(res, 'Internal server error');
  }
};

export default {
  getUserActivity,
};
