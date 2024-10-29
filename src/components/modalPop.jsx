import ReactDOM from "react-dom";

const portatRoot = document.getElementById("modal");

export default function ModalPop({ children, isOpen, closeModal }) {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div
      onClick={() => {
        closeModal && closeModal();
      }}
      className={`fixed w-full h-screen top-0 left-0 bg-MODAL_BACKGROUND flex z-50 justify-center  overflow-hidden md:p-4 p-2`}
    >
      {children}
    </div>,
    portatRoot
  );
}
