import express, { Application } from "express";
import router from "./router";
import cors from "cors";

//-----------------

const app: Application = express();
app.use(cors({ origin: true, methods: ["GET", "POST", "PATCH", "UPDATE", "DELETE"]}));

app.use(express.json());

app.use(router)

export default app;