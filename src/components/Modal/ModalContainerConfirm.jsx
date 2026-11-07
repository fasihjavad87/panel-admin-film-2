// components/Modal/ModalContainerConfirm.jsx

import { useEffect, useState } from "react";

import ConfirmModal2 from "./ConfirmModal2";
import { modalListeners } from "./modal";

const ModalContainerConfirm = () => {

    const [modals, setModals] = useState([]);

    useEffect(() => {

        const listener = (modal) => {

            setModals(prev => [
                ...prev,
                modal
            ]);

            document.body.style.overflow =
                "hidden";
        };

        modalListeners.push(listener);

        return () => {

            modalListeners.splice(
                modalListeners.indexOf(listener),
                1
            );

            modals.forEach(modal => {
                modal.resolve(false);
            });

            document.body.style.overflow =
                "auto";
        };

    }, []);

    const closeModal = (
        id,
        result,
        resolve
    ) => {

        setModals(prev =>
            prev.filter(
                modal => modal.id !== id
            )
        );

        resolve(result);

        setTimeout(() => {

            const remain =
                document.querySelectorAll(
                    "[data-modal]"
                ).length;

            if (remain <= 1) {

                document.body.style.overflow =
                    "auto";

            }

        }, 50);
    };

    return (
        <>
            {
                modals.map(modal => (
                    <div
                        key={modal.id}
                        data-modal
                    >

                        <ConfirmModal2
                            modal={modal}
                            onClose={(result) =>
                                closeModal(
                                    modal.id,
                                    result,
                                    modal.resolve
                                )
                            }
                        />

                    </div>
                ))
            }
        </>
    );
};

export default ModalContainerConfirm;