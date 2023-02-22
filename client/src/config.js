const API = {
  baseURL: "http://localhost:3001",
  host: "http://localhost",
  port: 3001,
  v1: {
    auth: "/api/v1/login",
    employees: "/api/v1/employees",
    logout: "/api/v1/logout",
    refresh: "/api/v1/refresh",
    register: "/api/v1/register",
    users: "/api/v1/users",
  },
};

const DB = {
  local: {
    host: "localhost",
    port: 5432,
    database: "easyai",
    user: "easyai",
    password: "organized",
    max: 10,
    connectionTimeoutMillis: 60,
    idleTimeoutMillis: 0,
  },
};

module.exports = { API, DB };
