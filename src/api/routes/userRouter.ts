import { Router } from 'express';
import Container from "typedi";
import { Users } from '../repos/users';

export class UserRouter {
    setupRouter(): Router {
        let users = Container.get(Users);
        let router = Router();

        router.post("/user/updateUser", users.update);
        router.post("/user/updatePassword", users.updatePassword);
        router.post("/user/disable", users.disable);
        router.post("/user/createPasswordReset", users.createPasswordReset);
        router.post("/user/doPasswordReset", users.doPasswordReset);
        router.post("/user/forgotUsername", users.forgotUsername);
        router.get("/user/", users.getUser);
        
        return router;
    }
}