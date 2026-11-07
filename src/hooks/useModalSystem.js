// hooks/useModalSystem.js
import { useModal } from "../components/ModalSystem";

export const useModalSystem = () => {
  const { addModal, removeModal, updateModal, clearAll } = useModal();

  const alert = (options) => {
    return addModal({
      type: "alert",
      title: options.title || "اطلاعیه",
      message: options.message,
      confirmText: options.confirmText || "متوجه شدم",
      icon: options.icon,
      backdropClose: options.backdropClose || false,
      onConfirm: options.onConfirm,
      onClose: options.onClose,
    });
  };

  const confirm = (options) => {
    return new Promise((resolve) => {
      addModal({
        type: "confirm",
        title: options.title || "تاییدیه",
        message: options.message,
        confirmText: options.confirmText || "بله",
        cancelText: options.cancelText || "خیر",
        icon: options.icon,
        backdropClose: false,
        onConfirm: (result) => {
          resolve(result);
          if (options.onConfirm) options.onConfirm(result);
        },
        onClose: () => {
          resolve(false);
          if (options.onClose) options.onClose();
        },
      });
    });
  };

  const customModal = (options) => {
    return addModal({
      ...options,
      type: options.type || "alert",
    });
  };

  const closeModal = (id) => {
    removeModal(id);
  };

  const closeAll = () => {
    clearAll();
  };

  return {
    alert,
    confirm,
    customModal,
    closeModal,
    closeAll,
  };
};
