const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../server");
require("dotenv").config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL);
});

describe("POST /api/v1/group", () => {
  it("should create a new group", async () => {
    const response = await request(app).post("/api/v1/group").send({
      title: "Test Group",
      admin: "2k2hj@example.com",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toEqual("Test Group");
  });
});

afterAll(async () => {
  // Properly disconnect from the MongoDB instance
  await mongoose.disconnect();
});
