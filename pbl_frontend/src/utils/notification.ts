import { notification } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

const showNotification = (
  type: NotificationType,
  message: string,
  description?: string
) => {
  notification[type]({
    description: description,
    message: message,
    placement: "topRight",
    duration: 2,
  });
};

export default showNotification;
