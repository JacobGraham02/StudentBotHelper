import { instance } from "../index";

export const requestUserGithub = async (code: string) => {
  try {
    console.log(instance);
    const response = await instance.post("user/oauth/github", {
      code,
    });

    return response.data;
  } catch (error) {
    throw new Error("Error sending GitHub code to backend");
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

export const loginUser = async (userData) => {
  try {
    const response = await instance.post("user/login", userData);

    return response.data;
  } catch (error) {
    console.error("Error registering user: ", error);
    throw error;
  }
};
