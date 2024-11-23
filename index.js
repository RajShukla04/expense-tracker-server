import { app } from "./app.js";
import dotenv from "dotenv";
import connectToDatabase from "./database/database.js";
dotenv.config({
  path: "./.env",
});

connectToDatabase()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`app is listning on port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("database connection failed! ", error);
  });
