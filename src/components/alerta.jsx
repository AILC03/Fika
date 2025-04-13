import React from "react";

export default function ConfirmModal({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-opacity-30 flex justify-center items-center">
      <div className="bg-yellow-100 border border-yellow-300 p-6 rounded-lg w-[700px] shadow-lg relative">
        {/* Botón de cerrar */}
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
        >
          ✕
        </button>

        {/* Título */}
        <h2 className="text-lg font-semibold text-yellow-900 mb-2">
          ¿Estás seguro de este cambio?
        </h2>

        {/* Mensaje */}
        <p className="text-sm text-gray-600">
          No podrás recuperar este cambio.
          <br />
          Este es un cambio permanente, tendrás que volver a registrar la
          información manualmente.
        </p>

        {/* Botones */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1 bg-amber-900 text-white rounded-md text-sm hover:bg-amber-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
