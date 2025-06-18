import { Model } from 'sequelize';
import { UserActivity } from '../userActivity';
import { Vehicle, VehicleAttributes } from '../vehiclesModel';
import { serializeVehicleForUserActivity } from '../../serializer/vehicleSerializer';

interface ModelWithPrevious<T extends object> extends Model<T, Partial<T>> {
  _previousDataValues: T;
}

export const registerVehicleHooks = () => {
  let previousDataMap = new WeakMap<Model, VehicleAttributes>();

  Vehicle.beforeUpdate((instance: ModelWithPrevious<VehicleAttributes>) => {
    previousDataMap.set(instance, { ...instance._previousDataValues });
  });

  Vehicle.beforeCreate((instance: ModelWithPrevious<VehicleAttributes>) => {
    previousDataMap.set(instance, { ...instance._previousDataValues });
  });

  Vehicle.beforeDestroy((instance: ModelWithPrevious<VehicleAttributes>) => {
    previousDataMap.set(instance, { ...instance._previousDataValues });
  });

  Vehicle.addHook('afterCreate', async (vehicle, options) => {
    const userId = (options as any).userId;

    const prevVehicle = previousDataMap.get(vehicle);
    const currentVehicle = vehicle.get();

    const formattedPrevVehicle = prevVehicle ? await serializeVehicleForUserActivity(prevVehicle) : null;
    const formattedCurrentVehicle = currentVehicle ? await serializeVehicleForUserActivity(currentVehicle) : null;

    await UserActivity.create({
      userId: userId,
      modelType: 'vehicle',
      actionType: 'CREATE',
      previousValue: JSON.stringify(formattedPrevVehicle),
      currentValue: JSON.stringify(formattedCurrentVehicle),
    });
  });

  Vehicle.addHook('afterUpdate', async (vehicle, options) => {
    const userId = (options as any).userId;
    const changedFields = vehicle.changed();
    if (!changedFields) return;

    const prevVehicle = previousDataMap.get(vehicle);
    const currentVehicle = vehicle.get();
    const formattedPrevVehicle = prevVehicle ? await serializeVehicleForUserActivity(prevVehicle) : null;
    const formattedCurrentVehicle = currentVehicle ? await serializeVehicleForUserActivity(currentVehicle) : null;

    await UserActivity.create({
      userId: userId,
      modelType: 'vehicle',
      actionType: 'UPDATE',
      previousValue: JSON.stringify(formattedPrevVehicle),
      currentValue: JSON.stringify(formattedCurrentVehicle),
    });
  });

  Vehicle.addHook('afterDestroy', async (vehicle, options) => {
    const userId = (options as any).userId;

    const prevVehicle = previousDataMap.get(vehicle);
    const currentVehicle = vehicle.get();
    const formattedPrevVehicle = prevVehicle ? await serializeVehicleForUserActivity(prevVehicle) : null;
    const formattedCurrentVehicle = currentVehicle ? await serializeVehicleForUserActivity(currentVehicle) : null;

    await UserActivity.create({
      userId: userId,
      modelType: 'vehicle',
      actionType: 'DELETE',
      previousValue: JSON.stringify(formattedPrevVehicle),
      currentValue: JSON.stringify(formattedCurrentVehicle),
    });
  });
};

