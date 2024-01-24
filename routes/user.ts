import express, { Router, Request, Response, NextFunction } from 'express';

const router: Router = express.Router();

/* GET users listing. */
router.get('/', function(request: Request, response: Response, next: NextFunction) {
  response.render('user/index', {
    page_title: "Student Bot Helper portal"
  });
});

router.get('/logout', function(request: Request, res: Response, next: NextFunction) {
  
});

router.get('/bot-commands', function(request: Request, response: Response, next: NextFunction) {
  response.render('user/bot-commands', {
    page_title: "Bot commands", 
  });
});

router.post('create-bot-command', function(request: Request, response: Response, next: NextFunction) {
  
});

router.delete('delete-bot-command', function(request: Request, response: Response, next: NextFunction) {
  
});

router.get('/bot-commands/:file', function(request: Request, response: Response, next: NextFunction) {
  response.render('user/bot-command', {
    page_title: "Edit bot command"
  })
});

router.post('/bot-commands/:file', function(request: Request, response: Response, next: NextFunction) {

});

router.get('/bot-log-files', function(request: Request, response: Response, next: NextFunction) {
  response.render('user/bot-logs', {
    page_title: "View bot logs"
  });
});

router.get('/download-bot-log-file', function(request: Request, response: Response, next: NextFunction) {

});

router.get('/bot-configuration-options', function(request: Request, response: Response, next: NextFunction) {

});

router.post('/bot-configuration-options-change', function(request: Request, response: Response, next: NextFunction) {

});

export default router
