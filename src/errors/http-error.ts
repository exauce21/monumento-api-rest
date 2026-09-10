export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data: unknown = null,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const notFoundError = (message: string, data: unknown = null) => new HttpError(404, message, data);
export const badRequestError = (message: string, data: unknown = null) => new HttpError(400, message, data);
export const unauthorizedError = (message: string, data: unknown = null) => new HttpError(401, message, data);
export const forbiddenError = (message: string, data: unknown = null) => new HttpError(403, message, data);
export const internalServerError = (message: string, data: unknown = null) => new HttpError(500, message, data);