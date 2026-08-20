import api from "./axiosClient";

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me"),
  updateProfile: (payload) => api.put("/auth/profile", payload),
};

export const eventApi = {
  list: (params) => api.get("/events", { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (payload) => api.post("/events", payload),
  update: (id, payload) => api.put(`/events/${id}`, payload),
  remove: (id) => api.delete(`/events/${id}`),
  popular: () => api.get("/events/stats/popular"),
  publicStats: () => api.get("/events/stats/public"),
};

export const registrationApi = {
  apply: (event_id) => api.post("/registrations", { event_id }),
  myRegistrations: () => api.get("/registrations/me"),
  listByEvent: (eventId) => api.get(`/registrations/event/${eventId}`),
  updateStatus: (id, status) => api.patch(`/registrations/${id}/status`, { status }),
};

export const categoryApi = {
  list: () => api.get("/categories"),
};

export const organizationApi = {
  list: () => api.get("/organizations"),
  me: () => api.get("/organizations/me"),
  update: (payload) => api.put("/organizations/me", payload),
};
