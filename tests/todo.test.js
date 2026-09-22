const request = require('supertest');
const app = require('../src/app');
// Impor Model untuk membersihkan database
const User = require('../src/models/user.model');
const Todo = require('../src/models/todo.model');

async function registerAndLogin(email = "athirr@example.com", name = "Athirr") {
  await request(app).post("/api/auth/register").send({
    name,
    email,
    password: "rahasia123",
  });

  const loginRes = await request(app).post("/api/auth/login").send({
    email,
    password: "rahasia123",
  });

  return loginRes.body.data.token;
}

describe("Todo Endpoints", () => {
  let token;

  beforeEach(async () => {
    // 1. DIBERSIHKAN: Reset database agar setiap test berjalan terisolasi
    await User.deleteMany({});
    await Todo.deleteMany({});

    token = await registerAndLogin();
  });

  describe("POST /api/todos", () => {
    it("should create a new todo when authenticated", async () => {
      const res = await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Belajar Jest dan Supertest" });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.title).toBe("Belajar Jest dan Supertest");
      expect(res.body.data.completed).toBe(false);
    });

    it("should reject creating todo without authentication", async () => {
      const res = await request(app)
        .post("/api/todos")
        .send({ title: "Tanpa token" });

      expect(res.statusCode).toBe(401);
    });

    it("should reject title shorter than 3 characters", async () => {
      const res = await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "ab" });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/between 3 and 100/i);
    });
  });

  describe("GET /api/todos", () => {
    it("should return paginated todos for the logged-in user", async () => {
      for (let i = 1; i <= 3; i++) {
        await request(app)
          .post("/api/todos")
          .set("Authorization", `Bearer ${token}`)
          .send({ title: `Todo ke-${i}` });
      }

      const res = await request(app)
        .get("/api/todos?page=1&limit=2")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination.totalItems).toBe(3);
      expect(res.body.pagination.totalPages).toBe(2);
    });

    it("should not return todos belonging to another user", async () => {
      await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Todo milik desta" });

      // 2. PERBAIKAN EMAIL: Gunakan email lain agar tidak 409 Conflict
      const otherToken = await registerAndLogin("otheruser@example.com", "otheruser");

      const res = await request(app)
        .get("/api/todos")
        .set("Authorization", `Bearer ${otherToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(0);
    });
  });

  describe("DELETE /api/todos/:id", () => {
    it("should not allow deleting another user's todo", async () => {
      const createRes = await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Todo milik desta" });

      // Support baik properti ._id maupun .id
      const todoId = createRes.body.data._id || createRes.body.data.id;
      
      // 3. PERBAIKAN EMAIL: Gunakan email lain
      const otherToken = await registerAndLogin("otheruser@example.com", "otheruser");

      const res = await request(app)
        .delete(`/api/todos/${todoId}`)
        .set("Authorization", `Bearer ${otherToken}`);

      expect(res.statusCode).toBe(403);
    });

    it("should return 404 when deleting a non-existent todo", async () => {
      const fakeId = "665f1c2e8b1e2a1a2c3d9999";

      const res = await request(app)
        .delete(`/api/todos/${fakeId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });
});