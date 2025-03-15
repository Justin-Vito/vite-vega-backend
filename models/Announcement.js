import { DataTypes } from 'sequelize';
import db from '../dbconnect.js';

const Announcement = db.define('Announcement', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  created_by: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  timestamps: false,
});

export default Announcement;