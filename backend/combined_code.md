

## api\placeholder.js

```js

```


## app.js

```js

```


## db\client.js

```js
import { Pool } from "pg";
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
});
// Test connection and log any errors during pool creation or connection
pool.on("connect", () => {
  console.log("Successfully connected to the PostgreSQL database pool");
});
export default pool;
```


## db\queries\placeholder.js

```js

```


## db\schema.sql

```
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS property CASCADE;
DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS rent_payments CASCADE;
DROP TABLE IF EXISTS utility_information CASCADE;
DROP TABLE IF EXISTS maintenance_requests CASCADE;
DROP TABLE IF EXISTS maintenance_photos CASCADE;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    unit INTEGER REFERENCES units(id) NOT NULL,
    is_manager BOOLEAN NOT NULL,
    is_current_user BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE properties(
    property_id SERIAL NOT NULL,
    property_name VARCHAR(255)
);

CREATE TABLE units(
    id SERIAL PRIMARY KEY, 
    property_id INTEGER REFERENCES properties(id) NOT NULL, 
    unit_number INTEGER UNIQUE NOT NULL,
    rent_amount DECIMAL(10, 2),
    notes TEXT,
    tenants VARCHAR(255)
);

CREATE TABLE announcements(
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    announcement TEXT NOT NULL,
    owner VARCHAR(255) NOT NULL,
    announcement_type VARCHAR(255) NOT NULL 
);

CREATE TABLE rent_payments(
    id SERIAL PRIMARY KEY,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE NOT NULL,
    paid_date TIMESTAMP,
    receipt_number VARCHAR(50),
    payment_amount DECIMAL(10, 2) NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    unit INTEGER REFERENCES units(id) NOT NULL
);

CREATE TABLE utility_information(
    user_id INTEGER REFERENCES users(id) NOT NULL PRIMARY KEY,
    water_cost DECIMAL(10, 2),
    water_usage DECIMAL,
    electric_usage DECIMAL,
    electric_cost DECIMAL(10, 2),
    gas_cost DECIMAL(10, 2),
    gas_usage DECIMAL,
    due_date DATE,
    paid_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE maintenance_requests(
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    img_url TEXT,
    information TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    unit_number INTEGER REFERENCES units(id) NOT NULL, 
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE maintenance_photos (
    id SERIAL PRIMARY KEY,
    maintenance_request_id INTEGER REFERENCES maintenance_requests(id) ON DELETE CASCADE, 
    photo_url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```


## db\seed.js

```js

```


## middleware\getUserFromToken.js

```js
import { getUserById } from "#db/queries/users";
import { verifyToken } from "#utils/jwt";

/** Attaches the user to the request if a valid token is provided */
export default async function getUserFromToken(req, res, next) {
  const authorization = req.get("authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) return next();

  const token = authorization.split(" ")[1];
  try {
    const { id } = verifyToken(token);
    const user = await getUserById(id);
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    res.status(401).send("Invalid token.");
  }
}

//=== TO DO === make getUserByID function

```


## middleware\requireBody.js

```js
/** Checks if the request body contains the required fields */
export default function requireBody(fields) {
  return (req, res, next) => {
    if (!req.body) return res.status(400).send("Request body is required.");

    const missing = fields.filter((field) => !(field in req.body));
    if (missing.length > 0)
      return res.status(400).send(`Missing fields: ${missing.join(", ")}`);

    next();
  };
}

```


## middleware\requireUser.js

```js
/** Requires a logged-in user */
export default async function requireUser(req, res, next) {
  if (!req.user) return res.status(401).send("Unauthorized");
  next();
}

```


## server.js

```js
import app from "#app";
import db from "#db/client";

const PORT = process.env.PORT ?? 3000;

await db.connect();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

// === TO DO === update to use pool

```


## utilities\jwt.js

```js
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

/** Creates a token with the given payload */
export function createToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

/** Extracts the payload from a token */
export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

```
