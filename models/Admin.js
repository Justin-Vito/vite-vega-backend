import { DataTypes } from 'sequelize';
import db from '../dbconnect.js';

const Admin = db.define('Admin', {
  official_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  household_id: { type: DataTypes.INTEGER },
  first_name: { type: DataTypes.STRING },
  last_name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  contact_num: { type: DataTypes.STRING },
  position: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'admin' },
  password: { type: DataTypes.STRING, allowNull: false }
}, {
  timestamps: false
});

export default Admin;