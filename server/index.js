import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";

// import routes
import userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/property.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send({ message: "hello world!" });
});

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/property", propertyRouter);

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);

    app.listen(8800, () => {
      console.log("server is started");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
