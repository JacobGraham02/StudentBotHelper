const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

import DatabaseConnectionManager from "./DatabaseConnectionManager";
import IUserProfileOptions from "./IUserProfileOptions";

export default class User {
  database_manager: DatabaseConnectionManager;
  database;

  constructor() {
    const database_config = {
      admin_username: process.env.mysql_server_admin_username!,
      admin_password: process.env.mysql_server_admin_password!,
      host_uri: process.env.mysql_server_admin_hostname!,
      name: process.env.mysql_server_admin_database_name!,
      port: process.env.mysql_server_admin_connection_port!,
      ssl_certificate_path:
        process.env.mysql_server_admin_path_to_ssl_certificate!,
    };

    // const database_config = {
    //   admin_username: "studentbot",
    //   admin_password: "studentbot123",
    //   host_uri: "localhost",
    //   name: "student_bot",
    //   port: "3307",
    //   ssl_certificate_path: "",
    // };
    this.database_manager = new DatabaseConnectionManager(database_config);
  }

  async init() {
    this.database = await this.database_manager.getConnection();
  }

  async createUser(
    fullName,
    email,
    password,
    refresh_token = null,
    roleId = 1,
    oauthProvider = null,
    oauthUserId = null,
    oauthUserInfo = null
  ) {
    try {
      await this.init();
      const hashedPassword = await bcrypt.hash(password, 10);
      const now = new Date();
      const userId = uuidv4();

      if (refresh_token === null) {
        refresh_token = uuidv4();
      }

      const [rows] = await this.database.query(
        "INSERT INTO Users (id, full_name, email, password_hash, oauth_provider, oauth_user_id, oauth_user_info, refresh_token, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          userId,
          fullName,
          email,
          hashedPassword,
          oauthProvider,
          oauthUserId,
          JSON.stringify(oauthUserInfo),
          refresh_token,
          roleId,
        ]
      );
      return { fullName, email, oauthUserInfo, refresh_token, roleId };
    } catch (error) {
      console.error(error);
      throw new Error("Authentication failed");
    }
  }

  async loginUser(email, password) {
    try {
      await this.init();
      const [users] = await this.database.query(
        "SELECT Users.*, Roles.name AS role_name FROM Users LEFT JOIN Roles ON Users.role_id = Roles.id WHERE Users.email = ?",
        [email]
      );
      const user = users[0];

      let username = null;

      if (user.oauthUserInfo !== null) {
        const oAuthObj = JSON.parse(user.oauthUserInfo);

        username = oAuthObj?.username || oAuthObj?.name;
      }

      if (user && (await bcrypt.compare(password, user.password_hash))) {
        // Generate JWT token
        const token = jwt.sign(
          {
            id: user.id,
            token: user.refresh_token,
            name: user.fullName || username,
            email: user.email,
            role: user.role_id,
          },
          "very super secret token",
          { expiresIn: "1h" }
        );

        console.log({
          token: token,
          expires_in: "1 hour",
          name: user.full_name,
          email: user.email,
          role: user.role_id,
        });

        return {
          token: token,
          id: user.id,
          expires_in: "1 hour",
          name: user.full_name,
          email: user.email,
          role: user.role_id,
        };
      }
    } catch (error) {
      throw new Error("Authentication failed");
    }
  }

  async findUserByEmail(email: string) {
    try {
      await this.init();

      const [rows] = await this.database.query(
        "SELECT * FROM Users WHERE email = ?",
        [email]
      );

      console.log(rows.id);

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Error querying the database:", error);
      throw error;
    }
  }

  async findUserByOauthUserId(oauth_user_id: string) {
    try {
      const [rows] = await this.database.query(
        "SELECT * FROM Users WHERE oauth_user_id = ?",
        [oauth_user_id]
      );

      if (rows.length > 0) {
        return rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error finding user by oauth_user_id:", error);
      throw new Error("Failed to find user by oauth_user_id");
    }
  }

    async changeUserNameAndEmail(userProfileOptions: IUserProfileOptions) {
      try {
        await this.init();

        // Check if the user with the provided email exists
        const existingUser = await this.findUserByEmail(userProfileOptions.email);
        if (!existingUser) {
            throw new Error('User not found');
        }

        // Update user information
        const [result] = await this.database.query(
            'UPDATE Users SET full_name = ?, email = ? WHERE email = ?',
            [userProfileOptions.name, userProfileOptions.email]
        );

        // Check if the update was successful
        if (result.affectedRows === 1) {
            return { success: true, message: 'User information updated successfully' };
        } else {
            throw new Error('Failed to update user information');
        }
    } catch (error) {
        console.error('Error updating user information:', error);
        throw error;
    }
  }
}
