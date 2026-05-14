import { describe, it, expect, beforeEach, afterEach } from "vitest";
import MockAdapter from "axios-mock-adapter";
import { authApi, businessApi, analyzeApi } from "./api";
import api from "./api";

// ── baseURL construction ───────────────────────────────────────────────────

describe("baseURL", () => {
  it("baseURL ends with /api", () => {
    const base = api.defaults.baseURL ?? "";
    expect(base.endsWith("/api")).toBe(true);
  });

  it("baseURL does not contain /api/api", () => {
    expect(api.defaults.baseURL).not.toContain("/api/api");
  });
});

// ── URL construction helper ────────────────────────────────────────────────

function buildBaseURL(viteApiUrl: string | undefined): string {
  const raw = viteApiUrl ?? "";
  return raw ? `${raw.replace(/\/api\/?$/, "")}/api` : "/api";
}

describe("buildBaseURL", () => {
  it("returns /api when VITE_API_URL is empty", () => {
    expect(buildBaseURL(undefined)).toBe("/api");
    expect(buildBaseURL("")).toBe("/api");
  });

  it("appends /api to a bare production URL", () => {
    expect(buildBaseURL("https://apanalytics-backend.fly.dev")).toBe(
      "https://apanalytics-backend.fly.dev/api"
    );
  });

  it("does not double-append /api when URL already ends with /api", () => {
    expect(buildBaseURL("https://apanalytics-backend.fly.dev/api")).toBe(
      "https://apanalytics-backend.fly.dev/api"
    );
  });

  it("does not double-append /api for localhost with /api suffix", () => {
    expect(buildBaseURL("http://localhost:4000/api")).toBe("http://localhost:4000/api");
  });
});

// ── auth endpoints ─────────────────────────────────────────────────────────

describe("authApi", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  afterEach(() => {
    mock.restore();
  });

  it("register posts to /auth/register", async () => {
    const payload = { email: "test@test.com", password: "pass123", name: "Test" };
    const response = { user: { id: "1", email: payload.email, name: payload.name }, token: "tok" };
    mock.onPost("/auth/register").reply(200, response);

    const res = await authApi.register(payload);
    expect(res.data).toEqual(response);
    expect(mock.history.post[0].url).toBe("/auth/register");
  });

  it("login posts to /auth/login", async () => {
    const payload = { email: "test@test.com", password: "pass123" };
    const response = { user: { id: "1", email: payload.email, name: "Test" }, token: "tok" };
    mock.onPost("/auth/login").reply(200, response);

    const res = await authApi.login(payload);
    expect(res.data).toEqual(response);
    expect(mock.history.post[0].url).toBe("/auth/login");
  });

  it("me calls GET /auth/me", async () => {
    const response = { user: { id: "1", email: "test@test.com", name: "Test" } };
    mock.onGet("/auth/me").reply(200, response);

    const res = await authApi.me();
    expect(res.data).toEqual(response);
    expect(mock.history.get[0].url).toBe("/auth/me");
  });

  it("returns 401 on wrong credentials", async () => {
    mock.onPost("/auth/login").reply(401, { error: "Invalid credentials" });
    await expect(authApi.login({ email: "x@x.com", password: "wrong" })).rejects.toThrow();
  });
});

// ── business endpoints ─────────────────────────────────────────────────────

describe("businessApi", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  afterEach(() => {
    mock.restore();
  });

  it("list calls GET /business", async () => {
    mock.onGet("/business").reply(200, { profiles: [] });
    const res = await businessApi.list();
    expect(res.data.profiles).toEqual([]);
    expect(mock.history.get[0].url).toBe("/business");
  });

  it("get calls GET /business/:id", async () => {
    const id = "abc123";
    mock.onGet(`/business/${id}`).reply(200, { profile: { id } });
    const res = await businessApi.get(id);
    expect(res.data.profile.id).toBe(id);
  });

  it("delete calls DELETE /business/:id", async () => {
    mock.onDelete("/business/abc123").reply(200, {});
    await expect(businessApi.delete("abc123")).resolves.toBeDefined();
    expect(mock.history.delete[0].url).toBe("/business/abc123");
  });
});

// ── analyze endpoints ──────────────────────────────────────────────────────

describe("analyzeApi", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  afterEach(() => {
    mock.restore();
  });

  it("run posts to /analyze/:profileId", async () => {
    const profileId = "profile-xyz";
    mock.onPost(`/analyze/${profileId}`).reply(200, { profile: { id: profileId } });
    const res = await analyzeApi.run(profileId);
    expect(res.data.profile.id).toBe(profileId);
    expect(mock.history.post[0].url).toBe(`/analyze/${profileId}`);
  });
});
