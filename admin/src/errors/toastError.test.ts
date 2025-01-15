import { handleToastError } from "./toastError";

describe("handleToastError", () => {
  let toast: jest.Mock;

  beforeEach(() => {
    toast = jest.fn();
  });

  it("should call toast with the error message when an Error object is passed", () => {
    const mockError = new Error("Something went wrong with the request");

    handleToastError(mockError, toast);

    expect(toast).toHaveBeenCalledWith({
      title: "Error",
      description: "Something went wrong with the request",
    });
  });

  it("should call toast with a default message when a non-Error object is passed", () => {
    const mockNonError = { someKey: "someValue" };

    handleToastError(mockNonError, toast);

    expect(toast).toHaveBeenCalledWith({
      title: "Error",
      description: "Something went wrong",
    });
  });

  it("should call toast with a default message when no error is passed", () => {
    const mockError = undefined;

    handleToastError(mockError, toast);

    expect(toast).toHaveBeenCalledWith({
      title: "Error",
      description: "Something went wrong",
    });
  });
});
