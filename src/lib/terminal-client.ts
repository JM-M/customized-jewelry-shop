import { TRPCError } from "@trpc/server";
import axios, { AxiosError, AxiosInstance } from "axios";

// Helper function to handle Terminal API errors
// Based on: https://docs.terminal.africa/tship/errors
function handleTerminalApiError(error: unknown, defaultMessage: string): never {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || defaultMessage;
    const statusCode = error.response?.status;

    // Map HTTP status codes to TRPC error codes based on Terminal API documentation
    let code:
      | "BAD_REQUEST"
      | "UNAUTHORIZED"
      | "FORBIDDEN"
      | "NOT_FOUND"
      | "INTERNAL_SERVER_ERROR" = "INTERNAL_SERVER_ERROR";

    if (statusCode === 400) code = "BAD_REQUEST";
    else if (statusCode === 401) code = "UNAUTHORIZED";
    else if (statusCode === 403) code = "FORBIDDEN";
    else if (statusCode === 404) code = "NOT_FOUND";
    // Handle 500, 501, 502, 503, 504 as internal server errors
    else if (statusCode && statusCode >= 500) code = "INTERNAL_SERVER_ERROR";

    throw new TRPCError({
      code,
      message,
    });
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: defaultMessage,
  });
}

// Create axios instance with base configuration
const createTerminalClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 30000, // 30 seconds timeout
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TERMINAL_SECRET_KEY}`,
    },
  });

  // Add response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // The error will be handled by individual procedures
      // This interceptor just ensures we have consistent error format
      return Promise.reject(error);
    },
  );

  return client;
};

// Create production and sandbox clients
export const terminalClient = createTerminalClient(
  process.env.TERMINAL_BASE_URL as string,
);
// TODO: Remove this once we have a production base URL
export const terminalSandboxClient = createTerminalClient(
  "https://sandbox.terminal.africa/v1",
);

// Helper function to safely make requests with error handling
export const makeTerminalRequest = async <T>(
  requestFn: () => Promise<{ data: T }>,
  errorMessage: string,
): Promise<T> => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    handleTerminalApiError(error, errorMessage);
  }
};

// Export the error handler for cases where manual error handling is needed
export { handleTerminalApiError };
