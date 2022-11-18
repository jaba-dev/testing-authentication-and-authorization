const request = require("supertest");
const app = require("../app");
const db = require("../config/test.db");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let auth = {};

beforeAll(async () => {
  const connection = await db.sequelize.sync();
});

beforeEach(async () => {
  const hashedPassword = await bcrypt.hash("secret", 1);
  const result = await request(app).post("/api/users").send({
    username: "test",
    password: hashedPassword,
  });
  const response = await request(app)
    .get("/api/users/secure/1")
    .send({ username: "test", password: "secret" });
  auth.token = response.body.token;
  auth.current_user_id = jsonwebtoken.decode(auth.token).user_id;
});

afterEach(async () => {
  const resultOne = await request(app).delete("/api/users");
});

afterAll(async () => {
  const dropTable = await request(app).delete("/api/users/drop");
  const result = await db.sequelize.close();
});

describe("GET /users without auth", () => {
  test("requires login", async () => {
    const response = await request(app).get("/api/users/secure/1").send({
      username: "test",
      password: "password",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe("username or password not correct");
  });
});
describe("GET /secure/:id", () => {
  test("authorizes only correct users", async () => {
    const response = await request(app)
      .get(`/api/users/70`)
      .set("authorization", auth.token);
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Unauthorized user");
  });
});
describe("GET /secure/:id", () => {
  test("authorizes only correct users", async () => {
    const response = await request(app)
      .get(`/api/users/${auth.current_user_id}`)
      .set("authorization", auth.token);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("success");
  });
});
