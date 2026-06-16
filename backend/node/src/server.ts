import express from "express";
import cors from "cors";
import router from "./routes.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api", router);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Preflight backend (node) listening on http://localhost:${PORT}`);
});
