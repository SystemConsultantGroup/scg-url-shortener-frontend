'use client';

import Modal from "./Modal";
import MagneticButton from "./MagneticButton";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="mb-8 text-zinc-500">{description}</p>
      <div className="flex justify-end gap-3">
        <MagneticButton variant="ghost" onClick={onClose} className="px-6">
          {cancelText}
        </MagneticButton>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="rounded-full bg-red-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
        >
          {isLoading ? "Processing..." : confirmText}
        </button>
      </div>
    </Modal>
  );
}
