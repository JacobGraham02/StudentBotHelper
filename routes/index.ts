import express, { Request, Response, NextFunction, Router } from 'express';

const router: Router = express.Router();

/* GET home page. */
router.get('/', function(request: Request, response: Response, next: NextFunction) {
  response.render('index', 
  { page_title: "Student Bot Helper portal" 
  });
});

router.get('/login', function(request: Request, response: Response, next: NextFunction) {
  response.render('login', {
    page_title: "Log in to your portal"
  });
});

router.get('/information', function(request: Request, response: Response, next: NextFunction) {
  response.render('information', {
    page_title: "Student Bot Helper info"
  });
});

export default router;