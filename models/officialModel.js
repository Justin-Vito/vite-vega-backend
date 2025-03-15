import { DataTypes } from 'sequelize';
import db from '../dbconnect.js';

const Officials = db.define('Officials', {
  official_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'officials',
  timestamps: false,
});

export default Officials;