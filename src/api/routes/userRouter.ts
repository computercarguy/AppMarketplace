import { Router } from 'express';
import Container from "typedi";
import { Users } from '../repos/users';

export class UserRouter {
    setupRouter(): Router {
        let users = Container.get(Users);
        let router = Router();

        router.post("/user/updateUser", (req, res) => users.update(req, res));
        router.post("/user/updatePassword", (req, res) => users.updatePassword(req, res));
        router.post("/user/disable", (req, res) => users.disable(req, res));
        router.post("/user/createPasswordReset", (req, res) => users.createPasswordReset(req, res));
        router.post("/user/doPasswordReset", (req, res) => users.doPasswordReset(req, res));
        router.post("/user/forgotUsername", (req, res) => users.forgotUsername(req, res));
        router.get("/user/", (req, res) => users.getUser(req, res));
        
        return router;
    }
}