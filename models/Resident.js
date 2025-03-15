import { DataTypes } from 'sequelize';
import db from '../dbconnect.js';

const Resident = db.define('Resident', {
    resident_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    household_id: { type: DataTypes.INTEGER },
    first_name: { type: DataTypes.STRING },
    last_name: { type: DataTypes.STRING },
    middle_int: { type: DataTypes.STRING },
    ext: { type: DataTypes.STRING },
    birth_place: { type: DataTypes.STRING },
    birth_date: { type: DataTypes.DATE },
    age: { type: DataTypes.INTEGER },
    gender: { type: DataTypes.STRING },
    contact_num: { type: DataTypes.STRING },
    civil_stat: { type: DataTypes.STRING },
    citizenship: { type: DataTypes.STRING },
    occupation: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING }, // Added address field
    email: { type: DataTypes.STRING, unique: true, allowNull: false }, // Added
    password: { type: DataTypes.STRING, allowNull: false } // Added
  }, {
    timestamps: false
  });

export default Resident;
