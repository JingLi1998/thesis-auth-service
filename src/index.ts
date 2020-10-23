import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import dotenv from "dotenv";
import cors from "cors";
import "reflect-metadata";
import morgan from "morgan";
import { router } from "./routes";
import "./config/passport";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";

const main = async () => {
  dotenv.config();

  // create database connection
  await createConnection({
    type: "postgres",
    url: process.env.ELEPHANT_URL,
    synchronize: true,
    // logging: true,
    entities: ["dist/database/src/entities/**/*.js"],
    cli: {
      entitiesDir: "src/entities",
    },
  });

  const app = express();

  app.use(
    cors({
      origin: ["http://localhost:3000", "https://www.trackntrace.network"],
      credentials: true,
    })
  );

  app.use(cookieParser());

  app.use(morgan("dev"));

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.use("/api", router);

  app.use(
    (error: HttpError, _req: Request, res: Response, _next: NextFunction) => {
      res.status(error.status || 500);
      res.json({
        status: error.status || 500,
        message: error.message,
      });
    }
  );

  app.listen(process.env.PORT || 8002, () => {
    console.log(
      `[server]: Server is running at Port ${process.env.PORT || 8002}`
    );
  });
};

main().catch((error) => console.log(error));
