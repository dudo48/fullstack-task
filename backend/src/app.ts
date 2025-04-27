import "dotenv/config";
import express, { Request, Response } from "express";
import pgPromise from "pg-promise";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

// for connection with postgresql
const pgp = pgPromise({});

// add middleware
app.use(express.json());
app.use(cors());

const db = pgp({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

const initDb = async () => {
  // because we must connect to any database in order to create a new one, 'postgres' is a default database existing in postgresql server
  const defaultDb = pgp({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: "postgres",
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  // create database if it does not exist
  return db
    .one("SELECT 1")
    .then(
      () => console.log(`Database '${process.env.DB_NAME}' exists`),
      () =>
        defaultDb
          .none("CREATE DATABASE $1:name", [process.env.DB_NAME])
          .then(() => console.log(`Database '${process.env.DB_NAME}' created`))
    )
    .then(() =>
      db.none(`CREATE TABLE IF NOT EXISTS apartments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(256) NOT NULL,
        apartment_number INTEGER NOT NULL,
        project_name VARCHAR(256) NOT NULL
      )`)
    );
};

app.get("/", (req: Request, res: Response) => {
  res.send(
    'Welcome! the main endpoint for this application is <a href="/apartments">/apartments</a>'
  );
});

// GET apartments listing
app.get("/apartments", (req: Request, res: Response) => {
  db.manyOrNone("SELECT * FROM apartments").then((data) => res.json(data));
});

// GET apartment details
app.get("/apartments/:apartmentId", (req: Request, res: Response) => {
  db.one("SELECT * FROM apartments WHERE id = $1", req.params.apartmentId)
    .then((data) => res.json(data))
    .catch(() => res.status(404).json({ error: "Apartment does not exist" }));
});

// POST create a new apartment
app.post("/apartments", (req: Request, res: Response) => {
  const schema = {
    name: "string",
    apartment_number: "number",
    project_name: "string",
  };
  const data = req.body;

  // validation
  for (const [field, type] of Object.entries(schema)) {
    if (!data || !data.hasOwnProperty(field) || typeof data[field] !== type) {
      res.json({
        error: `Request body must have a field '${field}' of type '${type}'`,
      });
      return;
    }
  }

  db.one(
    "INSERT INTO apartments (name, apartment_number, project_name) VALUES ($1, $2, $3) RETURNING id",
    [data.name, data.apartment_number, data.project_name]
  ).then((data) => res.status(201).json(data));
});

initDb().then(() =>
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  })
);
