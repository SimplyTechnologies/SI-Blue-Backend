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
  sold: boolean;
  userId: number;
  modelId: number;
}

export interface VehicleCreationAttributes extends Optional<VehicleAttributes, 'id'> {}

export class Vehicle extends Model<VehicleAttributes, VehicleCreationAttributes> implements VehicleAttributes {
  public id!: number;
  public year!: number;
  public vin!: string;
  public location!: LocationData;
  public sold!: boolean;
  public userId!: number;
  public modelId!: number;
}

export type SearchVehiclesParams = {
  search?: string;
  makeId?: number;
  modelIds?: number[];
  sold?: boolean;
  limit?: number;
  offset?: number;
};
