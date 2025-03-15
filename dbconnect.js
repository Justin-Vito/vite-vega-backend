import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME || 'Vite',
  process.env.DB_USER || 'admin',
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
  }
);

(async () => {
  try {
    await db.authenticate();
    console.log("✅ Database connection established successfully.");
    await db.sync({ alter: true });
    console.log("✅ Database synced successfully!");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
})();

export default db;