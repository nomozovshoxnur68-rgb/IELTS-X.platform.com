import { r as t } from "./index-HS6_bSfL.js";

const e = {
  reportEvent: async (e) => {
    await t.post("/exam-integrity/events", e);
  },
  reportEventOnUnload: (t) => {
    const e = localStorage.getItem("auth_token");
    fetch("https://api.ieltsx.com/exam-integrity/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(e ? { Authorization: `Bearer ${e}` } : {}),
      },
      body: JSON.stringify(t),
      keepalive: !0,
    }).catch(() => {});
  },
  listUsers: async (e) =>
    (await t.get("/admin/exam-integrity/users", { params: e })).data,
  listUserEvents: async (e) =>
    (await t.get(`/admin/exam-integrity/users/${e}/events`)).data,
  updateUserCase: async (e, a) =>
    (await t.patch(`/admin/exam-integrity/users/${e}/case`, a)).data,
};

export { e };