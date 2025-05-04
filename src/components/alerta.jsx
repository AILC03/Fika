import React from "react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm, // Nueva prop para manejar confirmación
  title = "Confirmación",
  message = "",
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  showCancelButton = true,
  confirmButtonColor = "bg-blue-600 hover:bg-blue-700",
}) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(); // Ejecuta la acción de confirmación si existe
    }
    onClose(); // Siempre cierra el modal
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Cerrar"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-4 text-gray-600">
            {typeof message === "string" ? <p>{message}</p> : message}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          {showCancelButton && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm} // Usa handleConfirm en lugar de onClose directamente
            className={`px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors ${confirmButtonColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
