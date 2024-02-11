import { access } from "fs";

const axios = require("axios");
const credentials = {
  google: {
    clientID: "",
    clientSecret: "",
  },
  github: {
    clientID: process.env.github_client_id,
    clientSecret: process.env.github_client_secret,
  },
};

class UserController {
  // Access the request token from GitHub
  async retrieveTokenGithub(code) {
    try {
      const response = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: credentials.github.clientID,
          client_secret: credentials.github.clientSecret,
          code: code,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const accessToken = response.data.access_token;
      return accessToken;
    } catch (error) {
      console.error("Error fetching access token from GitHub:", error);
      return null;
    }
  }

  // Use the request token to access the user's data
  async handleGithubLogin(code) {
    const accessToken = await this.retrieveTokenGithub(code);

    if (!accessToken) {
      console.error("Error getting access token");
      return null;
    }

    try {
      const response = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "Student Bot Helper",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching GitHub user profile:", error);
      return;
    }
  }
}
