import { AuthApiService } from "./auth.service";
import { apiClient } from "../../vars";
import { UserAuthType } from "../../../../shared/types";

// Mocking the apiClient to mock the API calls
jest.mock("../../vars", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe("AuthApiService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return data on successful sign-in", async () => {
    // Mock the response from the apiClient
    const mockResponse = { data: { token: "mockToken", user: { id: "1", name: "John Doe" } } };
    (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    // Call the signIn method
    const result = await AuthApiService.signIn("john@example.com", "password123", UserAuthType.Email);

    // Check that the apiClient.post method was called with correct arguments
    expect(apiClient.post).toHaveBeenCalledWith("/auth/sign-in", {
      email: "john@example.com",
      password: "password123",
      authType: UserAuthType.Email,
    });

    // Check that the result matches the mock response
    expect(result).toEqual(mockResponse.data);
  });

  it("should log an error when the sign-in fails", async () => {
    const mockError = new Error("Sign-in failed");
    // Mock an API call rejection
    (apiClient.post as jest.Mock).mockRejectedValueOnce(mockError);

    // Spy on console.log to verify error logging
    const consoleSpy = jest.spyOn(console, "log");

    // Call the signIn method
    await AuthApiService.signIn("john@example.com", "wrongPassword", UserAuthType.Email);

    // Verify that the error was logged
    expect(consoleSpy).toHaveBeenCalledWith(mockError);

    // Clean up the spy
    consoleSpy.mockRestore();
  });
});
