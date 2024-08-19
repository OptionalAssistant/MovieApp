import  sequelize  from './db';
import { Model, InferAttributes, InferCreationAttributes, CreationOptional,DataTypes } from 'sequelize';
import { IUser } from '../types/typesClient';



// Define the User model, using IUser for the user property
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> implements IUser {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare passwordHash: string;
  declare isActivated: boolean;
  declare roles: 'USER' | 'ADMIN'; // TypeScript type annotation

  

}

// Initialize the User model with actual Sequelize fields
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActivated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    roles:{
      type: DataTypes.ENUM('USER', 'ADMIN'),
      defaultValue : 'ADMIN'
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false
  }
);

export default User;