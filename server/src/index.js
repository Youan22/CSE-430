require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const medicationsRouter = require("./routes/medications");

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "\nMissing MONGODB_URI. This project uses MongoDB Atlas (see server/.env.example).\n" +
      "  npm run mean:setup   (from repo root — creates server/.env from the example)\n" +
      "  Then edit server/.env and paste your Atlas connection string.\n"
  );
  process.exit(1);
}

const app = express();

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? [process.env.CLIENT_ORIGIN]
  : ["http://localhost:4200", "http://127.0.0.1:4200"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/medications", medicationsRouter);

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (err) {
    console.error("\nCould not connect to MongoDB.");
    console.error("URI:", MONGODB_URI);
    console.error(
      "\nFix: check MONGODB_URI in server/.env (MongoDB Atlas connection string).\n" +
        "Atlas: confirm database user password, IP allowlist (0.0.0.0/0 for dev), and URI format.\n" +
        "Local MongoDB instead: set MONGODB_URI=mongodb://127.0.0.1:27017/safemeds and run the DB.\n"
    );
    console.error(err.message || err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
    console.log(
      "Angular: run from repo root — npm run angular   (or both: npm run mean:dev)"
    );
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
