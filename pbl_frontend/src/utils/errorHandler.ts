export type Failures = {
  reason: string;
  messgae: string;
};

export type RequestError = {
  failures: Failures[];
};

export class HttpRequestError extends Error {
  constructor(public failures: Failures[], public statusCode?: number) {
    super();
    Object.setPrototypeOf(this, HttpRequestError.prototype);
  }
}

export const handleError = (err: RequestError): void => {
  if (!err.failures) {
    throw err;
  }
};
