export class EdfaliHttpError extends Error {
  constructor(status, statusText, body) {
    super(`HTTP ${status} ${statusText}`);
    this.name = 'EdfaliHttpError';
    this.status = status;
    this.body = body;
  }
}

export class EdfaliResultError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'EdfaliResultError';
    this.details = details;
  }
}
