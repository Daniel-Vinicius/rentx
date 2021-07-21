import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { category } from "@modules/cars/test/fixture/CategoryFixture";
import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;
let headers: { Authorization: string };

describe("Create Category Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidv4();
    const password = await hash("admin", 8);

    await connection.query(`INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
    values('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'DRIVER')
    `);

    const responseToken = await request(app)
      .post("/sessions")
      .send({ email: "admin@rentx.com.br", password: "admin" });

    const { token } = responseToken.body;

    headers = {
      Authorization: `Bearer ${token}`,
    };
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new category", async () => {
    const response = await request(app)
      .post("/categories")
      .send(category)
      .set(headers);

    expect(response.status).toBe(201);
  });

  it("should not be able to create a new category with name exists", async () => {
    const response = await request(app)
      .post("/categories")
      .send(category)
      .set(headers);

    expect(response.status).toBe(400);
  });
});
