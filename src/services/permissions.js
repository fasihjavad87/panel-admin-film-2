import httpService from "./httpService";

export const permissionsGetService = (
  page = 1,
  count = 10,
  searchChar = "",
) => {
  return httpService(
    `/permissions?page=${page}&count=${count}&searchChar=${searchChar}`,
    "get",
  );
};

export const permissionsGetAllService = () => {
  return httpService("/permissions/all", "get");
};

export const getSinglrPermissionService = (permissionId) => {
  return httpService(`/permissions/${permissionId}`, "get");
};

export const permissionAddNewService = (data) => {
  return httpService("/permissions/create", "post", data);
};

export const permissionEditService = (permissionId, data) => {
  return httpService(`/permissions/${permissionId}/edit`, "put", data);
};

export const permissionDeleteService = (permissionId) => {
  return httpService(`/permissions/${permissionId}/delete`, "delete");
};

// export const roleSyncPermissionService = (roleId, data) => {
//   return httpService(`/roles/${roleId}/permission`, "put", data);
// };
