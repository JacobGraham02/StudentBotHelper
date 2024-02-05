import express, { Router, Request, Response, NextFunction } from "express";
const UserController = require("../controllers/UserController");
const userRouter: Router = express.Router();

/* GET users listing. */
userRouter.get(
  "/",
  function (request: Request, response: Response, next: NextFunction) {
    response.render("user/index", {
      page_title: "Student Bot Helper portal",
    });
  }
);

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

// OAuth Routes
userRouter.post("/oauth/github", async (req, res, next) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send("Authorization code is required");
  }

  const userProfile = await UserController.handleGithubLogin(code);
  if (userProfile) {
    // Handle successful authentication, e.g., creating a user session
    res.json(userProfile);
  } else {
    // Handle failed authentication
    res.status(500).send("Authentication with GitHub failed");
  }
});

export default userRouter;
