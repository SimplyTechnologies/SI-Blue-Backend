import { Model } from 'sequelize';
import { Customer, CustomerAttributes } from '../customersModel';
import { UserActivity } from '../userActivity';

interface ModelWithPrevious<T extends object> extends Model<T, Partial<T>> {
  _previousDataValues: T;
}

export const registerCustomerHooks = () => {
  let previousDataMap = new WeakMap<Model, CustomerAttributes>();

  Customer.beforeDestroy((instance: ModelWithPrevious<CustomerAttributes>) => {
    previousDataMap.set(instance, { ...instance._previousDataValues });
  });

  Customer.addHook('afterDestroy', async (customer, options) => {
    const userId = (options as any).userId;

    const prevCustomer = previousDataMap.get(customer) || null;
    const currentCustomer = customer.get() || null;

    await UserActivity.create({
      userId: userId,
      modelType: 'customer',
      actionType: 'DELETE',
      previousValue: prevCustomer,
      currentValue: currentCustomer,
    });
  });
};

