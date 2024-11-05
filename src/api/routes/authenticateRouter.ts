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

        router.post('/auth/logout', (req, res) => authenticate.logout(req, res));
        router.post("/auth/register", (req, res) => authenticate.registerUser(req, res));
        router.post("/auth/checkUsernameEmail", (req, res) => authenticate.checkUsernameEmail(req, res));
        router.get("/auth/validate", (req, res) => authenticate.validateUser(req, res));
        router.get("/auth/userid", (req, res) => authenticate.getUserId(req, res));
        router.get("/auth/passwordcomplexity", (req, res) => authenticate.getPasswordComplexity(req, res));

        return router;
    }
}