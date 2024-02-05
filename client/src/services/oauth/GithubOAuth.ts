import axios from "axios";
import { OAuthCreds } from "../../../config";

const credentials = {
  client_id: OAuthCreds.github.clientID,
  client_secret: OAuthCreds.github.clientSecret,
};

const handleLogin = async () => {
  // Get access token from Github API
  const accessToken = await retrieveToken;

  if (accessToken === null) {
    // Error getting access token
    return;
  }

  //   get the users information.
  const userProfile = await axios
    .post("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "Student-Helper-Bot",
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
    });

  return userProfile;
};

const retrieveToken = () => {
  try {
    // Ehance the code for an access token
    axios
      .post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: credentials.client_id,
          client_secret: credentials.client_secret,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching access token - Github OAUTH", error);
      });
  } catch (error) {
    console.error("Error fetching access token - Github OAUTH", error);
  }
};
