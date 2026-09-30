const express = require("express");
const cors = require("cors");

const analysisRoutes = require("./routes/analysis.routes");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "TrustNoFile backend is running",
  });
});

app.use("/api", analysisRoutes);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});