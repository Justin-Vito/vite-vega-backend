import { Sequelize } from 'sequelize';
import db from '../dbconnect.js';

export const Official = db.define('Official', {
  official_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  first_name: { type: Sequelize.STRING, allowNull: false },
  last_name: { type: Sequelize.STRING, allowNull: false },
  middle_int: { type: Sequelize.STRING, defaultValue: "" },
  birth_date: { type: Sequelize.DATE, defaultValue: null },
  position: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false, unique: true },
  password: { type: Sequelize.STRING, allowNull: false },
});