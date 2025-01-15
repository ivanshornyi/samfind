import { handleApiError } from "./apiError";

describe("handleApiError", () => {
  it("should throw a specific error message when error.response.data.message is provided", () => {
    const mockError = {
      response: {
        data: {
          message: "Custom error message",
        },
      },
    };

    expect(() => handleApiError(mockError)).toThrow("Custom error message");
  });

  it("should throw a default error message when error.response.data.message is not provided", () => {
    const mockError = {
      response: {
        data: {},
      },
    };

    expect(() => handleApiError(mockError)).toThrow("Something went wrong.");
  });

  it("should throw a 'Server connection error' when error.response is not present", () => {
    const mockError = {};

    expect(() => handleApiError(mockError)).toThrow("Server connection error");
  });
});
