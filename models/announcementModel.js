import { Sequelize } from 'sequelize';
import db from '../dbconnect.js';

export const Announcement = db.define('Announcement', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: Sequelize.STRING, allowNull: false },
  content: { type: Sequelize.TEXT, allowNull: false },
});