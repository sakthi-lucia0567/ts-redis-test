import { Request, Response, NextFunction } from "express";

const errorHandlerMiddleware = (
  err: Error | unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Define a default error response
  if (res.headersSent) {
    return next(err);
  }

  let errorResponse = {
    status: 500,
    message: "Something went wrong!",
  };

  // Handle specific error types
  if (err instanceof Error) {
    console.error(err.stack);

    // Handle validation errors
    if (err.name === "ValidationError") {
      errorResponse.status = 400;
      errorResponse.message = "Invalid data provided";
      return res
        .status(errorResponse.status)
        .json({ error: errorResponse.message });
    }

    // Handle not found errors
    if (err.message.includes("not found")) {
      errorResponse.status = 404;
      errorResponse.message = "Resource not found";
      return res
        .status(errorResponse.status)
        .json({ error: errorResponse.message });
    }

    // Handle unauthorized errors
    if (err.message.includes("unauthorized")) {
      errorResponse.status = 401;
      errorResponse.message = "Unauthorized access";
      return res
        .status(errorResponse.status)
        .json({ error: errorResponse.message });
    }

    // Handle forbidden errors
    if (err.message.includes("forbidden")) {
      errorResponse.status = 403;
      errorResponse.message = "Forbidden action";
      return res
        .status(errorResponse.status)
        .json({ error: errorResponse.message });
    }

    // Handle conflict errors
    if (err.message.includes("conflict")) {
      errorResponse.status = 409;
      errorResponse.message = "Conflict detected";
      return res
        .status(errorResponse.status)
        .json({ error: errorResponse.message });
    }

    // Handle other known errors (add as needed)
    // ...
  } else {
    // Handle unknown type here if needed
    console.error("Unknown error:", err);
  }

  // Send the error response
  res.status(errorResponse.status).json({ error: errorResponse.message });
};

export default errorHandlerMiddleware;
