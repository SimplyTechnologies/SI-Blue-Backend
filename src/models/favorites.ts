import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

export interface FavoriteAttributes {
  id: number;
  userId: number;
  vehicleId: number;
}

export interface FavoriteCreationAttributes extends Optional<FavoriteAttributes, 'id'> {}

export class Favorite extends Model<FavoriteAttributes, FavoriteCreationAttributes> implements FavoriteAttributes {
  public id!: number;
  public userId!: number;
  public vehicleId!: number;
}

export const defineFavoriteModel = (sequelize: Sequelize): typeof Favorite => {
  Favorite.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'vehicle',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'favorites',
      timestamps: false,
      underscored: false,
    },
  );

  return Favorite;
};

export type FavoriteType = typeof Favorite;