interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-effect rounded-lg p-6 w-full max-w-md border border-primary/20">
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
} 