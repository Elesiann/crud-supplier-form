import { notifications } from "@mantine/notifications";
import classes from "./notification.module.css";

export const handleNotification = (title: string, message: string, color: "green" | "red") => {
  notifications.show({
    title,
    message,
    color,
    limit: 1,
    position: "top-right",
    classNames: classes
  });
};
