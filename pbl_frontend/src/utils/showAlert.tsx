import AlertComponent from "../components/Alert";

export const showErrorAlert = (message: string): void => {
  <AlertComponent message={message} type="error" />;
};

export const showSuccessAlert = (message: string): void => {
  <AlertComponent message={message} type="success" />;
};

export const showInfoAlert = (message: string): void => {
  <AlertComponent message={message} type="info" />;
};

export const showWarningAlert = (message: string): void => {
  <AlertComponent message={message} type="warning" />;
};
