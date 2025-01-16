export const handleApiError = (error: any) => {
  console.log('handle api error: ', error)
  if (error.response && error.response.data) {
    throw new Error(error.response.data.message || "Something went wrong.");
  }

  throw new Error("Server connection error");
};
