import { Router } from 'express';
import Container from "typedi";
import { Authenticate } from '../repos/authenticate';

export class AuthenticateRouter {
    setupRouter(): Router {
        let authenticate = Container.get(Authenticate);
        let authenticateRouter = Router();

        authenticateRouter.post('/auth/login',  (req, res) => {  
            /*  
                #swagger.parameters['body'] = { in: 'body', description: 'text', required: true, schema: {
                    username: 'JohnDoe',
                    password: 'Pa55w0rd'
                }}
            */

            authenticate.login(req, res);
        });

        authenticateRouter.post('/auth/logout', authenticate.logout);
        authenticateRouter.post("/auth/register", authenticate.registerUser);
        authenticateRouter.get("/auth/validate", authenticate.validateUser);
        authenticateRouter.get("/auth/userid", authenticate.getUserId);
        
        return authenticateRouter;
    }
}