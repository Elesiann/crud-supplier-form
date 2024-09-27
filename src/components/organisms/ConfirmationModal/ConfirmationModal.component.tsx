import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { ReactNode } from "react";

interface ConfirmationModalProps {
  children: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  text: string;
  centered?: boolean;
  labels?: { confirm: string; cancel: string };
}

export default function ConfirmationModal({
  children,
  onConfirm,
  onCancel,
  title,
  text,
  centered,
  labels = {
    confirm: `Confirm`,
    cancel: `Cancel`
  }
}: ConfirmationModalProps) {
  const openConfirmationModal = () =>
    modals.openConfirmModal({
      title,
      centered,
      children: <Text size="sm">{text} </Text>,
      labels: { confirm: labels?.confirm, cancel: labels?.cancel },
      confirmProps: { color: "red" },
      onCancel: () => onCancel(),
      onConfirm: () => onConfirm()
    });

  return (
    <div onClick={openConfirmationModal} color="red">
      {children}
    </div>
  );
}
