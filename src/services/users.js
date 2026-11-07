import httpService from "./httpService";

export const usersGetService = (page = 1, count = 10, searchChar = "") => {
  return httpService(
    `/users?page=${page}&count=${count}&searchChar=${searchChar}`,
    "get",
  );
};

export const usersGetTrashedService = (page = 1, count = 10, searchChar = "") => {
  return httpService(
    `/users/trashed?page=${page}&count=${count}&searchChar=${searchChar}`,
    "get",
  );
};

export const getSinglrUserService = (userId) => {
  return httpService(`/users/${userId}`, "get");
};

export const userAddNewService = (data) => {
  return httpService("/users/create", "post", data);
};

export const userEditService = (userId, data) => {
  return httpService(`/users/${userId}/edit`, "put", data);
};

export const userSoftDeleteService = (userId) => {
  return httpService(`/users/${userId}/delete`, "delete");
};

export const userGroupSoftDeleteService = (data) => {
  return httpService(`/users/group-delete`, "delete", data);
};

export const userRestoreService = (userId) => {
  return httpService(`/users/${userId}/restore`, "post");
};

export const userForceDeleteService = (userId) => {
  return httpService(`/users/${userId}/force-delete`, "delete");
};

export const userSyncRoleService = (userId, data) => {
  return httpService(`/users/${userId}/roles`, "put", data);
};
