export const getErrorMessage = (error: any): string => {
    if (error?.response?.data?.message) return error.response.data.message;

    if (error?.response?.data?.error) return error.response.data.error;

    return 'Something went wrong';
};
