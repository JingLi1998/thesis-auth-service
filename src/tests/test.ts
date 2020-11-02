import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import dotenv from "dotenv";

process.env.NODE_ENV = "test";
dotenv.config();

const BASE_URL = process.env.INTEGRATION_URL;
chai.use(chaiHttp);

describe("Integration testing for TracknTrace.Network", function () {
  describe("Test authorisation endpoints", function () {
    it("should log in a user", function () {
      chai
        .request(BASE_URL)
        .post("/auth/api/login")
        .send({
          email: process.env.INTEGRATION_EMAIL,
          password: process.env.INTEGRATION_PASSWORD,
        })
        .then(function (res) {
          expect(res).to.have.status(200);
        });
    });
  });

  describe("Test query endpoints", function () {
    let agent: ChaiHttp.Agent;
    let loginResponse: any;

    beforeEach(async function () {
      agent = chai.request.agent(BASE_URL);
      loginResponse = await agent.post("/auth/api/login").send({
        email: process.env.INTEGRATION_EMAIL,
        password: process.env.INTEGRATION_PASSWORD,
      });
    });

    it("should query a stock unit", function () {
      expect(loginResponse).to.have.cookie("jwt");
      agent.get("/query/api/stock-unit/1").then(function (res) {
        agent.close();
        expect(res).to.have.status(200);
      });
    });

    it("should query a batch", function () {
      expect(loginResponse).to.have.cookie("jwt");
      agent.get("/query/api/batch/1").then(function (res) {
        agent.close();
        expect(res).to.have.status(200);
      });
    });

    it("should query a logistic", function () {
      expect(loginResponse).to.have.cookie("jwt");
      agent.get("/query/api/logistic/1").then(function (res) {
        agent.close();
        expect(res).to.have.status(200);
      });
    });

    it("should query a transport", function () {
      expect(loginResponse).to.have.cookie("jwt");
      agent.get("/query/api/transport/1").then(function (res) {
        agent.close();
        expect(res).to.have.status(200);
      });
    });

    it("should query a location", function () {
      expect(loginResponse).to.have.cookie("jwt");
      agent.get("/query/api/location/1").then(function (res) {
        agent.close();
        expect(res).to.have.status(200);
      });
    });

    it("should query a asset unit", function () {
      expect(loginResponse).to.have.cookie("jwt");
      agent.get("/query/api/asset-unit/1").then(function (res) {
        agent.close();
        expect(res).to.have.status(200);
      });
    });

    it("should query a transport unit", function () {
      expect(loginResponse).to.have.cookie("jwt");
      agent.get("/query/api/transport-unit/1").then(function (res) {
        agent.close();
        expect(res).to.have.status(200);
      });
    });
  });

  describe("Test publish endpoints", function () {
    it("should create an asset unit", function () {
      chai
        .request(BASE_URL)
        .post("/publish/api/asset-unit")
        .send({
          asset_type: "pallet",
        })
        .then(function (res) {
          expect(res).to.have.status(201);
        });
    });

    it("should create an transport unit", function () {
      chai
        .request(BASE_URL)
        .post("/publish/api/transport-unit")
        .send({
          brand: "honda",
          model: "civic",
        })
        .then(function (res) {
          expect(res).to.have.status(201);
        });
    });
  });
});
