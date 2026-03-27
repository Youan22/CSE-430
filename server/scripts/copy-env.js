const fs = require("fs");
const path = require("path");

const serverDir = path.join(__dirname, "..");
const dest = path.join(serverDir, ".env");
const src = path.join(serverDir, ".env.example");

if (fs.existsSync(dest)) {
  console.log("server/.env already exists; not overwriting.");
  process.exit(0);
}

fs.copyFileSync(src, dest);
console.log(
  "Created server/.env from .env.example\n" +
    "Edit server/.env: set MONGODB_URI to your MongoDB Atlas connection string.\n"
);
