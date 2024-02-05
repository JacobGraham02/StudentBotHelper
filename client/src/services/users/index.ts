import { instance } from "../index";

export const requestUserGithub = async (code: string) => {
  try {
    const response = await instance.post("user/oauth/github", {
      code,
    });

    return response.data;
  } catch (error) {
    console.error("Error sending GitHub code to backend:", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await instance.post("user/register", userData);

    return response.data;
  } catch (error) {
    console.error("Error registering user: ", error);
    throw error;
  }
};
