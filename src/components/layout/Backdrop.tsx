"use client";

type BackdropProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Backdrop({ isOpen, onClose }: BackdropProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className="z-999 fixed inset-0 bg-gray-900/50 lg:hidden"
    />
  );
}
