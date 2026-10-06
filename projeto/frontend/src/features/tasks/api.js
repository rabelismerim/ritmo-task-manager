import { request } from "../../shared/api/client";
export const tasksApi = {
  lists: (token, signal) => request("/list/", { token, signal }),
  createList: (token, name) =>
    request("/list/", { token, method: "POST", body: { name } }),
  deleteList: (token, id) =>
    request(`/list/${id}/`, { token, method: "DELETE" }),
  createItem: (token, list, name) =>
    request("/item/", { token, method: "POST", body: { list, name } }),
  toggleItem: (token, item) =>
    request(`/item/${item.id}/`, {
      token,
      method: "PATCH",
      body: { done: !item.done },
    }),
  deleteItem: (token, id) =>
    request(`/item/${id}/`, { token, method: "DELETE" }),
};
