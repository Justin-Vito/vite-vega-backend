import { Sequelize } from 'sequelize';

const db = new Sequelize('Vite', 'root', '', {
  host: '127.0.0.1', // Explicitly use IPv4 localhost instead of ::1
  dialect: 'mysql',
  port: 3306, // Explicitly specify port
});

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