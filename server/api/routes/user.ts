import express, { Router, Request, Response, NextFunction } from "express";
import UserController from "../controllers/UserController";
import BotRepository from "../../database/MongoDB/BotRepository";
import BotController from "../controllers/BotController";
import { body, validationResult } from "express-validator";
import { randomUUID } from "crypto";

const userRouter: Router = express.Router();
const userController = new UserController();

/* GET users listing. */
userRouter.get(
  "/",
  function (request: Request, response: Response, next: NextFunction) {
    response.render("user/index", {
      page_title: "Student Bot Helper portal",
    });
  }
);

userRouter.post('/register', [ 
    body('fullName').trim().matches(/^[A-Za-z\s'-]+$/).withMessage(`The bot full name must only contain letters, spaces, apostrophes, and hyphens`).isLength({min:1}).withMessage(`The length of the bot full name must be greater than or equal to 1`),
    body('email').trim().matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).withMessage(`Your account email must match the pattern shown on screen`),
    body('password').trim().isLength({min: 8}).withMessage(`Your account password must be at least 8 characters long`),
    body('confirmPassword').trim().matches('password').withMessage(`The confirmation password must be the same as your account password. This is to ensure you entered the password correctly`)
  ], 
  async function(request: Request, response: Response, next: NextFunction) {
    const {
      fullName,
      email,
      password,
      confirmPassword
    }: {
      fullName: string,
      email: string,
      password: string,
      confirmPassword: string
    } = request.body;

    const requestValidationErrors = validationResult(request);
    if (!requestValidationErrors.isEmpty()) {
      return response.status(400).json({
        success: false,
        message: `Please try submitting the form again with the correct inputs as specified on the form`
      });
    }

    const registerNewBotObject = {
      bot_id: randomUUID(),
      bot_username: fullName,
      bot_email: email,
      bot_password: password
    }

  try {
    const bot_database_repository_instance: BotRepository = new BotRepository();
    const bot_controller_instance: BotController = new BotController(bot_database_repository_instance);
    
    await bot_controller_instance.insertBotDocumentIntoMongoDB(registerNewBotObject);

    return response.status(200).json({
      success: true,
      message: "Bot was registered successfully",
    });
  } catch (error) {
    console.error(`An error occurred when attempting to register a bot document with the /register endpoint: ${error}`);
    return response.status(500).json({ 
      success: false, 
      message: `An internal server error occurred when attempting to register a bot document with the /register endpoint` 
    });
  }
});

userRouter.get(
  "/logout",
  function (request: Request, res: Response, next: NextFunction) {}
);

userRouter.get(
  "/bot-commands",
  function (request: Request, response: Response, next: NextFunction) {
    response.render("user/bot-commands", {
      page_title: "Bot commands",
    });
  }
);

userRouter.post(
  "create-bot-command",
  function (request: Request, response: Response, next: NextFunction) {}
);

userRouter.delete(
  "delete-bot-command",
  function (request: Request, response: Response, next: NextFunction) {}
);

userRouter.get(
  "/bot-commands/:file",
  function (request: Request, response: Response, next: NextFunction) {
    response.render("user/bot-command", {
      page_title: "Edit bot command",
    });
  }
);

userRouter.post(
  "/bot-commands/:file",
  function (request: Request, response: Response, next: NextFunction) {}
);

userRouter.get(
  "/bot-log-files",
  function (request: Request, response: Response, next: NextFunction) {
    response.render("user/bot-logs", {
      page_title: "View bot logs",
    });
  }
);

userRouter.get(
  "/download-bot-log-file",
  function (request: Request, response: Response, next: NextFunction) {}
);

userRouter.get(
  "/bot-configuration-options",
  function (request: Request, response: Response, next: NextFunction) {}
);

userRouter.post(
  "/bot-configuration-options-change",
  function (request: Request, response: Response, next: NextFunction) {}
);

// Register User - POST /users/register
userRouter.post("/register", async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (!email || !password || !fullName || !confirmPassword) {
    return res
      .status(400)
      .json({ message: "Missing required registration details." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match!!!" });
  }

  try {
    const userProfile = await userController.registerUser({
      fullName,
      email,
      password,
    });

    if (!userProfile) {
      return res.status(500).json({ message: "Failed to register user." });
    }

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error: any) {
    if (error.message.includes("duplicate")) {
      return res.status(409).json({ message: "Email already in use." });
    }

    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ message: "An error occurred during registration." });
  }
});

// Login User - POST /users/login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const loginResult = await userController.loginUser(email, password);

    if (loginResult && loginResult.user?.token) {
      return res.status(200).json({
        message: "Login successful",
        user: loginResult.user,
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "An error occurred during login.",
      error: error.message,
    });
  }
});

// OAuth Routes
userRouter.post("/oauth/github", async (req, res, next) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).send("Authorization code is required");
  }

  const userProfile = await userController.handleGithubLogin(code);

  if (!userProfile) {
    // Handle failed authentication
    return res.status(500).send("Authentication with GitHub failed");
  }

  return res.status(201).json({
    ...userProfile,
  });
});

export default userRouter;
