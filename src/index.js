import { app } from "./app.js";
import connectDB from "./db/index.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`App listening on Port: ${process.env.PORT}`);
    });

    app.on("error", (err) => {
      console.log(`Error while connecting to ${process.env.PORT}`, err);
    });
  })
  .catch((error) => {
    console.log(`Connection to database failed!!`, error);
  });
