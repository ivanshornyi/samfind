import { userApiService } from "./user.service";
import { apiClient } from "../../vars";
import { handleApiError } from "../../errors";
import { User, UserAuthType, UserRole, UserStatus } from "../../../../shared/types";

jest.mock("../../vars", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

jest.mock("../../errors", () => ({
  handleApiError: jest.fn(),
}));

describe("findUsers", () => {
  const mockUsers: User[] = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      authType: UserAuthType.Email,
      role: UserRole.Admin,
      status: UserStatus.Active,
      emailResetCode: null,
      emailResetCodeExpiresAt: null,
      discount: 0,
      referralCode: 12312,
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      authType: UserAuthType.Email,
      role: UserRole.Customer,
      status: UserStatus.Active,
      emailResetCode: null,
      emailResetCodeExpiresAt: null,
      discount: 0,
      referralCode: 123123,
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a list of users on success", async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockUsers });

    const result = await userApiService.findUsers("John", 0, 10);

    expect(apiClient.get).toHaveBeenCalledWith("/user/find", {
      params: { name: "John", offset: 0, limit: 10 },
    });
    expect(result).toEqual(mockUsers);
  });

  it("should return an empty array when no users are found", async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: [] });
    const result = await userApiService.findUsers("NonExistentUser", 0, 10);
    expect(result).toEqual([]);
  });

  it("should return undefined on error", async () => {
    const mockError = new Error("API error");
    (apiClient.get as jest.Mock).mockRejectedValueOnce(mockError);

    const result = await userApiService.findUsers("John", 0, 10);

    expect(apiClient.get).toHaveBeenCalledWith("/user/find", {
      params: { name: "John", offset: 0, limit: 10 },
    });
    expect(handleApiError).toHaveBeenCalledWith(mockError);
    expect(result).toBeUndefined();
  });
});

describe("findUserById", () => {
  const mockUser: User = {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    authType: UserAuthType.Email,
    role: UserRole.Admin,
    status: UserStatus.Active,
    emailResetCode: null,
    emailResetCodeExpiresAt: null,
    discount: 0,
    referralCode: 12312,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a user on success", async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockUser });

    const result = await userApiService.findUserById("1");

    expect(apiClient.get).toHaveBeenCalledWith("/user/1");
    expect(result).toEqual(mockUser);
  });

  it("should return undefined when the user is not found", async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: undefined });

    const result = await userApiService.findUserById("0");

    expect(apiClient.get).toHaveBeenCalledWith("/user/0");
    expect(result).toBeUndefined();
  });

  it("should throw an error when the API request fails", async () => {
    const mockError = new Error("API error");
    (apiClient.get as jest.Mock).mockRejectedValueOnce(mockError);

    const result = await userApiService.findUserById("1");

    expect(apiClient.get).toHaveBeenCalledWith("/user/1");
    expect(handleApiError).toHaveBeenCalledWith(mockError);
    expect(result).toBeUndefined();
  });
});

