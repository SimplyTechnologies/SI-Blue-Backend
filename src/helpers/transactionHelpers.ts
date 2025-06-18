import { Transaction } from 'sequelize';
import { getSequelizeInstance } from '../configs/database';

export const runInTransaction = async <T>(callback: (transaction: Transaction) => Promise<T>) => {
  const sequelize = await getSequelizeInstance();
  const transaction = await sequelize.transaction();

  try {
    const result = await callback(transaction);
    await transaction.commit();
    return result;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};
