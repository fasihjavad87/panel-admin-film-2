import httpService from "./httpService";

export const devicesGetUserService = (userId) => {
  return httpService(`/devices/user/${userId}`, "get");
};

export const revokeUserDeviceService = (userId, deviceId) => {
  return httpService(`/devices/user/${userId}/device/${deviceId}`, "delete");
};

export const revokeAllUserDevicesService = (userId) => {
  return httpService(`/devices/user/${userId}/all`, "delete");
};