import { Sequelize } from 'sequelize';
import db from '../dbconnect.js';

export const Appointment = db.define('Appointment', {
  appointment_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: Sequelize.STRING, allowNull: false },
  date: { type: Sequelize.DATE, allowNull: false },
  content: { type: Sequelize.TEXT, allowNull: false },
});