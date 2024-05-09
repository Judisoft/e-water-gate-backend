const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../server");
require("dotenv").config();

/** connecting to the database before running the tests */
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL);
});

describe("POST /api/v1/contact", () => {
  it("should create a new contact", async () => {
    const response = await request(app).post("/api/v1/contact").send({
      userName: "John Doe",
      email: "2k2hj@example.com",
      message: "This is a test message",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Message sent successfully",
    });
  });
});

/** disconnecting from the database after running the tests */
afterAll(async () => {
  await mongoose.disconnect();
});
