import httpService from "./httpService";

export const categoriesGetService = (
  page = 1,
  count = 10,
  searchChar = "",
) => {
  return httpService(
    `/categories?page=${page}&count=${count}&searchChar=${searchChar}`,
    "get",
  );
};

export const categoriesGetAllService = () => {
  return httpService("/categories/all", "get");
};

export const getSinglrCategoryService = (categoryId) => {
  return httpService(`/categories/${categoryId}`, "get");
};

export const categoryAddNewService = (data) => {
  return httpService("/categories/create", "post", data);
};

export const categoryEditService = (categoryId, data) => {
  return httpService(`/categories/${categoryId}/edit`, "put", data);
};

export const categoryDeleteService = (categoryId) => {
  return httpService(`/categories/${categoryId}/delete`, "delete");
};

// export const roleSyncPermissionService = (roleId, data) => {
//   return httpService(`/roles/${roleId}/permission`, "put", data);
// };
