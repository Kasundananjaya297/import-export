/** @format */
export const responseDTO = (success: string, data: any, message: String) => {
  return { success: success, data: data, message: message };
};
