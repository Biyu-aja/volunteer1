import api from "./axiosClient";

export const authApi = {
  register: (payload) => api.post("/api/auth/register", payload),
  login: (payload) => api.post("/api/auth/login", payload),
  me: () => api.get("/api/auth/me"),
  updateProfile: (payload) => api.put("/api/auth/profile", payload),
};

export const eventApi = {
  list: (params) => api.get("/api/events", { params }),
  getById: (id) => api.get(`/api/events/${id}`),
  create: (payload) => api.post("/api/events", payload),
  update: (id, payload) => api.put(`/api/events/${id}`, payload),
  remove: (id) => api.delete(`/api/events/${id}`),
  popular: () => api.get("/api/events/stats/popular"),
  publicStats: () => api.get("/api/events/stats/public"),
};

export const registrationApi = {
  apply: (event_id) => api.post("/api/registrations", { event_id }),
  myRegistrations: () => api.get("/api/registrations/me"),
  listByEvent: (eventId) => api.get(`/api/registrations/event/${eventId}`),
  updateStatus: (id, status) => api.patch(`/api/registrations/${id}/status`, { status }),
};

export const categoryApi = {
  list: () => api.get("/api/categories"),
};

export const organizationApi = {
  list: () => api.get("/api/organizations"),
  me: () => api.get("/api/organizations/me"),
  update: (payload) => api.put("/api/organizations/me", payload),
};

export const adminApi = {
  listOrganizations: () => api.get("/api/organizations/admin/all"),
  setOrganizationVerification: (id, is_verified) =>
    api.patch(`/api/organizations/${id}/verify`, { is_verified }),
};
