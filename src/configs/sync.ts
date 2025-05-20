import connectToDB from "./database.js";
import { defineUserModel } from "../models/usersModel.js";

const syncDatabase = async () => {
  try {
    const sequelize = await connectToDB();

    defineUserModel(sequelize); 

    await sequelize.authenticate();
    console.log(" Database connected");

    await sequelize.sync({ alter: true }); 
    console.log("Database synchronized");
  } catch (err) {
    console.error(" Database sync failed:", err);
  }
};

export { syncDatabase };
