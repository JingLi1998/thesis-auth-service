import express from "express";
import dotenv from "dotenv";

const main = async () => {
  dotenv.config();

  const app = express();
  app.get("/", (_req, res) => res.send("Express + Typescript Server"));

  app.listen(process.env.PORT || 8000, () => {
    console.log(
      `[server]: Server is running at Port ${process.env.PORT || 8000}`
    );
  });
};

main().catch((error) => console.log(error));
