import { request } from "../../shared/api/client";
export const login = (username, password) =>
  request("/api-token-auth/", { method: "POST", body: { username, password } });
