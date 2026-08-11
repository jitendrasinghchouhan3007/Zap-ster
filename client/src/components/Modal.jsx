import React from "react";

const Modal = ({ isOpen, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={` bg-white dark:bg-neutral-900 rounded-lg shadow-lg  max-h-[80%] overflow-y-auto p-10 custom-scrollbar outline-none`}
      >       {content}
      </div>
    </div>
  );
};

export default Modal;
