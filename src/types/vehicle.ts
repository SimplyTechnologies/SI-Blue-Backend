import { Model, Optional } from 'sequelize';

export interface LocationData {
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  additionalInfo?: string;
}

export interface VehicleAttributes {
  id: number;
  year: number;
  vin: string;
  location: LocationData;
  userId: number;
  modelId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VehicleCreationAttributes extends Optional<VehicleAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Vehicle extends Model<VehicleAttributes, VehicleCreationAttributes> implements VehicleAttributes {
  public id!: number;
  public year!: number;
  public vin!: string;
  public location!: LocationData;
  public userId!: number;
  public modelId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export type SearchVehiclesParams = {
  search?: string;
  makeId?: number;
  modelIds?: number[];
  sold?: boolean;
  limit?: number;
  offset?: number;
  userId?: string;
};

