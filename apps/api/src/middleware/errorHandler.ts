import type { NextFunction, Request, Response } from "express";

/** Error carrying an HTTP status and optional structured details. */
export class HttpError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.details = details;
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      ok: false,
      error: err.message,
      details: err.details,
    });
    return;
  }

  // Unexpected error: never leak internals to the client.
  // eslint-disable-next-line no-console
  console.error("Unexpected API error:", err);
  res.status(500).json({ ok: false, error: "Internal server error" });
}
