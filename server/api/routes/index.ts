import express, { Request, Response, NextFunction, Router } from 'express';

const indexRouter: Router = express.Router();

indexRouter.get('/', function(request: Request, response: Response, next: NextFunction) {
  response.send('The API routing is working');
});

indexRouter.get('/login', function(request: Request, response: Response, next: NextFunction) {
  response.render('login', {
    page_title: "Log in to your portal"
  });
});

indexRouter.get('/information', function(request: Request, response: Response, next: NextFunction) {
  response.render('information', {
    page_title: "Student Bot Helper info"
  });
});

export default indexRouter;