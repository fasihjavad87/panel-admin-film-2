import httpService from "./httpService";

export const countriesGetService = (
  page = 1,
  count = 10,
  searchChar = "",
) => {
  return httpService(
    `/countries?page=${page}&count=${count}&searchChar=${searchChar}`,
    "get",
  );
};

export const countriesGetAllService = () => {
  return httpService("/categories/all", "get");
};

export const getSinglrCountryService = (countryId) => {
  return httpService(`/countries/${countryId}`, "get");
};

export const countryAddNewService = (data) => {
  return httpService("/countries/create", "post", data);
};

export const countryEditService = (countryId, data) => {
  return httpService(`/countries/${countryId}/edit`, "put", data);
};

export const countryDeleteService = (countryId) => {
  return httpService(`/countries/${countryId}/delete`, "delete");
};

// export const roleSyncPermissionService = (roleId, data) => {
//   return httpService(`/roles/${roleId}/permission`, "put", data);
// };
