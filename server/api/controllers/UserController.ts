import { access } from "fs";
import User from "../../database/MySQL/UserClass";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
  user;
  constructor() {
    this.user = new User();
  }

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
    let accessToken;
    try {
      accessToken = await this.retrieveTokenGithub(code);
    } catch (error: any) {
      console.error("Error retrieving GitHub token:", error.message);
      return null; // Or handle the error appropriately
    }

    if (!accessToken) {
      console.error("Error: No access token received");
      return null;
    }

    try {
      const response = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "Student Bot Helper",
        },
      });
      const userProfile = response.data;

      console.log(userProfile);
      const existingUser = await this.user.findUserByOauthUserId(
        userProfile.id.toString()
      );
      if (existingUser) {
        return existingUser;
      } else {
        // Save the user data in the database
        const newUser = {
          fullName: userProfile.name,
          email: userProfile.email,
          password: null,
          oauthProvider: "github",
          oauthUserId: userProfile.id.toString(),
          oauthUserInfo: JSON.stringify(userProfile),
        };
        const userId = await this.user.createUser(newUser);

        return { ...newUser, id: userId };
      }

      // {
      //   login: 'DevOps242',
      //   id: 42576837,
      //   node_id: 'MDQ6VXNlcjQyNTc2ODM3',
      //   avatar_url: 'https://avatars.githubusercontent.com/u/42576837?v=4',
      //   gravatar_id: '',
      //   url: 'https://api.github.com/users/DevOps242',
      //   html_url: 'https://github.com/DevOps242',
      //   followers_url: 'https://api.github.com/users/DevOps242/followers',
      //   following_url: 'https://api.github.com/users/DevOps242/following{/other_user}',
      //   gists_url: 'https://api.github.com/users/DevOps242/gists{/gist_id}',
      //   starred_url: 'https://api.github.com/users/DevOps242/starred{/owner}{/repo}',
      //   subscriptions_url: 'https://api.github.com/users/DevOps242/subscriptions',
      //   organizations_url: 'https://api.github.com/users/DevOps242/orgs',
      //   repos_url: 'https://api.github.com/users/DevOps242/repos',
      //   events_url: 'https://api.github.com/users/DevOps242/events{/privacy}',
      //   received_events_url: 'https://api.github.com/users/DevOps242/received_events',
      //   type: 'User',
      //   site_admin: false,
      //   name: 'Akeem Palmer',
      //   company: '@phonicsolutions ',
      //   blog: 'https://www.akeempalmer.onrender.com/',
      //   location: 'Toronto',
      //   email: null,
      //   hireable: null,
      //   bio: 'Software Developer\r\n',
      //   twitter_username: null,
      //   public_repos: 13,
      //   public_gists: 0,
      //   followers: 9,
      //   following: 15,
      //   created_at: '2018-08-21T13:03:50Z',
      //   updated_at: '2024-01-26T12:19:16Z',
      //   private_gists: 0,
      //   total_private_repos: 52,
      //   owned_private_repos: 51,
      //   disk_usage: 287290,
      //   collaborators: 4,
      //   two_factor_authentication: true,
      //   plan: {
      //     name: 'free',
      //     space: 976562499,
      //     collaborators: 0,
      //     private_repos: 10000
      //   }
      // }
    } catch (error: any) {
      console.error("Error fetching GitHub user profile:", error.message);

      return null;
    }
  }

  async registerUser(userObj: any) {
    try {
      const { fullName, email, password } = userObj;

      const existingUser = await this.user.findUserByEmail(email);
      if (existingUser) {
        throw new Error("duplicate");
      }

      const newUser = await this.user.createUser(fullName, email, password);

      let username = null;

      if (newUser.oauthUserInfo !== null) {
        const oAuthObj = JSON.parse(newUser.oauthUserInfo);

        username = oAuthObj?.username || oAuthObj?.name;
      }

      return {
        token: newUser.refresh_token,
        email: newUser.email,
        role: newUser.roleId,
        name: newUser.fullName || username,
      };
    } catch (error: any) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async loginUser(email, password) {
    try {
      const user = await this.user.findUserByEmail(email);

      if (!user) {
        return { error: "Invalid email or password." };
      }

      const passwordIsValid = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!passwordIsValid) {
        return { error: "Invalid email or password" };
      }

      let username = null;

      if (user.oauthUserInfo && user.oauthUserInfo !== null) {
        const oAuthObj = JSON.parse(user.oauthUserInfo);

        username = oAuthObj?.username || oAuthObj?.name;
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          refreshToken: user.refresh_token,
          name: user.fullName || username,
          email: user.email,
          role: user.role_id,
        },
        "very super secret token",
        { expiresIn: "1h" }
      );

      // Return success response with token
      return {
        message: "Login successful",
        user: {
          token: token,
          name: user.full_name || username,
          email: user.email,
          role: user.role_id,
        },
      };
    } catch (error) {
      console.error("Login error:", error);
      return { error: "An error occurred during login." };
    }
  }
}

export default UserController;
