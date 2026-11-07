import httpService from "./httpService";

export const getDashboardStatsService = () => {
  return httpService(`/dashboard/stats`, "get");
};

export const getDashboardMonthlyService = () => {
  return httpService(`/dashboard/monthly`, "get");
};

export const getDashboardCountriesService = () => {
  return httpService(`/dashboard/countries`, "get");
};

export const getDashboardActivitiesService = (limit = 10) => {
  return httpService(`/dashboard/activities?limit=${limit}`, "get");
};

export const getDashboardRecentAddedService = (limit = 4) => {
  return httpService(`/dashboard/recent-added?limit=${limit}`, "get");
};
