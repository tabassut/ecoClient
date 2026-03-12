import { AxiosError } from "axios";

/**
 * Centralized error handler for API requests
 * Provides consistent error handling across all service calls
 */
export const handleApiError = (error: unknown): Promise<never> => {
    if (error instanceof AxiosError) {
        // Can add custom error processing here if needed
        // e.g., logging, specific error transformations, etc.
        return Promise.reject(error);
    }
    return Promise.reject(error);
};
