import { Router } from 'express';
import Container from "typedi";
import { Authenticate } from '../repos/authenticate';

export class AuthenticateRouter {
    setupRouter(): Router {
        let authenticate = Container.get(Authenticate);
        let router = Router();

        router.post('/auth/login',  (req, res) => {  
            /*  
                #swagger.parameters['body'] = { in: 'body', description: 'text', required: true, schema: {
                    username: 'JohnDoe',
                    password: 'Pa55w0rd'
                }}
            */

            authenticate.login(req, res);
        });

        router.post('/auth/logout', authenticate.logout);
        router.post("/auth/register", authenticate.registerUser);
        router.get("/auth/validate", authenticate.validateUser);
        router.get("/auth/userid", authenticate.getUserId);
        
        return router;
    }
}