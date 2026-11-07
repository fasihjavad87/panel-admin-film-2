import httpService from "./httpService";


export const rolesGetService = (page = 1, count = 10, searchChar = "") => {
  return httpService(
    `/roles?page=${page}&count=${count}&searchChar=${searchChar}`,
    "get",
  );
};

export const rolesGetAllService = () => {
  return httpService("/roles/all", "get");
};


export const getSinglrRoleService = (roleId) => {
  return httpService(`/roles/${roleId}`, "get");
};

export const roleAddNewService = (data) => {
  return httpService("/roles/create", "post", data);
};

export const roleEditService = (roleId, data) => {
  return httpService(`/roles/${roleId}/edit`, "put", data);
};

export const roleDeleteService = (roleId) => {
  return httpService(`/roles/${roleId}/delete`, "delete");
};

export const roleSyncPermissionService = (roleId, data) => {
  return httpService(`/roles/${roleId}/permissions`, "put", data);
};
