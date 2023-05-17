import showNotification from "./notification";

export type Failures = {
  reason: string;
  message: string;
};

export type RequestError = {
  statusCode: number;
  failures: Failures[];
};

export type ValidateError = {
  statusCode: number;
  message: string[];
  error: string;
};

export class HttpRequestError extends Error {
  constructor(public failures: Failures[], public statusCode?: number) {
    super();
    Object.setPrototypeOf(this, HttpRequestError.prototype);
  }
}

export const handleError = (err: RequestError | any): void => {
  if (!err.failures) {
    throw err;
  }

  const errorReason = err.failures
    .map((failure: Failures) => failure.reason)
    .join("</br>");
  const errorMessage =
    err.message ||
    err.failures.map((failure: Failures) => failure.message).join("</br>");

  showNotification("error", errorReason, errorMessage);
};

export const throwHttpRequestError = (err: any): HttpRequestError => {
  if (!err.response) {
    throw new HttpRequestError([
      { reason: "NetworkError", message: "Network Error" },
    ]);
  }
  throw new HttpRequestError(err.response.data.failures, err.response.status);
};