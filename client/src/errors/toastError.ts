export const handleToastError = (error: unknown, toast: any) => {
  const errorMessage = error instanceof Error ? error.message : "Something went wrong";

  toast({
    title: "Error",
    description: errorMessage,
  });
};