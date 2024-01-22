import express, { Router, Request, Response, NextFunction } from 'express';

const router: Router = express.Router();

/* GET users listing. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.send('respond with a resource');
});

export default router