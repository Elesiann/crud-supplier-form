import { notifications } from "@mantine/notifications";

export const handleNotification = (title: string, message: string, color: "green" | "red") => {
  notifications.show({
    title,
    message,
    color
  });
};
