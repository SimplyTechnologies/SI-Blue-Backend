import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
import { User } from './usersModel';
import { CarModel } from './carModelsModel';

export interface LocationData {
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  additionalInfo?: string;
  lat?:number;
  lng?:number;
}

interface VehicleAttributes {
  id: number;
  year: number;
  vin: string;
  location: LocationData;
  sold: boolean;
  userId?: number;
  modelId: number;
}

interface VehicleCreationAttributes extends Optional<VehicleAttributes, 'id'> {}

class Vehicle extends Model<VehicleAttributes, VehicleCreationAttributes> implements VehicleAttributes {
  public id!: number;
  public year!: number;
  public vin!: string;
  public location!: LocationData;
  public sold!: boolean;
  public userId!: number;
  public modelId!: number;

  static associate() {
    Vehicle.belongsToMany(User, {
      through: 'favorites',
      as: 'favorite',
      foreignKey: 'vehicleId',
      otherKey: 'userId',
    });
  }
}

const defineVehicleModel = (sequelize: Sequelize): typeof Vehicle => {
  Vehicle.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      year: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      vin: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      location: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          isValidLocation(value: LocationData) {
            if (!value.street || !value.city || !value.state || !value.zipcode || !value.country) {
              throw new Error('Location must include street, city, state, zipcode, and country');
            }
          },
        },
        get() {
          return this.getDataValue('location');
        },
        set(value: LocationData) {
          this.setDataValue('location', value);
        },
      },
      sold: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      // userId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   references: {
      //     model: User,
      //     key: 'id',
      //   },
      // },
      modelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: CarModel,
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      tableName: 'vehicle',
      timestamps: false,
      underscored: false,
    },
  );

  return Vehicle;
};

export { defineVehicleModel, Vehicle, VehicleAttributes, VehicleCreationAttributes };
