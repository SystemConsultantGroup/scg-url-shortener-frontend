'use client';

import { AnimatePresence, motion } from "framer-motion";
import { X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm dark:bg-black/40"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900"
            >
              <div className="mb-6 flex items-center justify-between">
                {title && (
                  <h3 className="text-lg font-bold tracking-tight text-foreground">{title}</h3>
                )}
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X />
                </button>
              </div>
              <div>{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
